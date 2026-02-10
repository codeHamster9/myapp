-- Data-Preserving Schema Migration for Pokemon Battle Arena
-- This migration is SAFE to run on existing databases
-- It will NOT delete any existing data

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create games table if it doesn't exist
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to games table (safe to run multiple times)
ALTER TABLE games ADD COLUMN IF NOT EXISTS player1_user_id TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS player1_pokemon_id INTEGER;
ALTER TABLE games ADD COLUMN IF NOT EXISTS player1_hp INTEGER DEFAULT 0;
ALTER TABLE games ADD COLUMN IF NOT EXISTS player1_moves JSONB DEFAULT '[]';
ALTER TABLE games ADD COLUMN IF NOT EXISTS player1_ready BOOLEAN DEFAULT FALSE;

ALTER TABLE games ADD COLUMN IF NOT EXISTS player2_user_id TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS player2_pokemon_id INTEGER;
ALTER TABLE games ADD COLUMN IF NOT EXISTS player2_hp INTEGER DEFAULT 0;
ALTER TABLE games ADD COLUMN IF NOT EXISTS player2_moves JSONB DEFAULT '[]';
ALTER TABLE games ADD COLUMN IF NOT EXISTS player2_ready BOOLEAN DEFAULT FALSE;

ALTER TABLE games ADD COLUMN IF NOT EXISTS current_turn INTEGER DEFAULT 1;
ALTER TABLE games ADD COLUMN IF NOT EXISTS winner_user_id TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS game_log JSONB DEFAULT '[]';

-- Create pokemon_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS pokemon_data (
  id SERIAL PRIMARY KEY,
  room_code TEXT NOT NULL,
  user_id TEXT NOT NULL,
  pokemon_id INTEGER NOT NULL,
  hp INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  selected_moves JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_code, user_id)
);

-- Add constraint to games.status if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'games_status_check'
  ) THEN
    ALTER TABLE games ADD CONSTRAINT games_status_check 
      CHECK (status IN ('waiting', 'in_progress', 'ended'));
  END IF;
END $$;

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate (ensures correct policies)
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on games" ON games;
DROP POLICY IF EXISTS "Allow all operations on pokemon_data" ON pokemon_data;

-- Create policies for public access (suitable for development)
-- TODO: Implement proper RLS policies for production
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
CREATE POLICY "Allow all operations on pokemon_data" ON pokemon_data FOR ALL USING (true);

-- Enable realtime replication (will show notice if already added)
DO $$
BEGIN
  -- Add games table to realtime publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'games'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE games;
  END IF;

  -- Add pokemon_data table to realtime publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'pokemon_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE pokemon_data;
  END IF;
END $$;
