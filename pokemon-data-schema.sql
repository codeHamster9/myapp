-- Create pokemon_data table for syncing pokemon state
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