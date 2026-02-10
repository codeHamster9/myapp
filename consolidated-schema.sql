-- Consolidated Database Schema for Pokemon Battle Arena
-- This schema matches the TypeScript types in lib/supabase.ts

-- Drop existing tables
DROP TABLE IF EXISTS pokemon_data CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table (consolidated structure matching TypeScript types)
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'ended')),
  
  -- Player 1
  player1_user_id TEXT,
  player1_pokemon_id INTEGER,
  player1_hp INTEGER DEFAULT 0,
  player1_moves JSONB DEFAULT '[]',
  player1_ready BOOLEAN DEFAULT FALSE,
  
  -- Player 2
  player2_user_id TEXT,
  player2_pokemon_id INTEGER,
  player2_hp INTEGER DEFAULT 0,
  player2_moves JSONB DEFAULT '[]',
  player2_ready BOOLEAN DEFAULT FALSE,
  
  -- Game state
  current_turn INTEGER DEFAULT 1,
  winner_user_id TEXT,
  game_log JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pokemon data table for syncing Pokemon state
CREATE TABLE pokemon_data (
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (suitable for development)
-- TODO: Implement proper RLS policies for production
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
CREATE POLICY "Allow all operations on pokemon_data" ON pokemon_data FOR ALL USING (true);

-- Enable realtime replication
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE pokemon_data;
