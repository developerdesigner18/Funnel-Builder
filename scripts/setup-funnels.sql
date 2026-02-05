-- Create funnels table
CREATE TABLE IF NOT EXISTS funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create funnel_nodes table
CREATE TABLE IF NOT EXISTS funnel_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  node_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create funnel_edges table
CREATE TABLE IF NOT EXISTS funnel_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  edge_id VARCHAR(255) NOT NULL,
  source_node_id VARCHAR(255) NOT NULL,
  target_node_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_funnel_nodes_funnel_id ON funnel_nodes(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_edges_funnel_id ON funnel_edges(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_edges_nodes ON funnel_edges(source_node_id, target_node_id);

-- Add unique constraint for upsert support
ALTER TABLE funnel_nodes ADD CONSTRAINT IF NOT EXISTS funnel_nodes_funnel_id_node_id_key UNIQUE (funnel_id, node_id);

-- Enable RLS
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_edges ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Access for now, swap with auth logic later)
-- Funnels
CREATE POLICY "Enable all for everyone" ON funnels FOR ALL USING (true) WITH CHECK (true);
-- Nodes
CREATE POLICY "Enable all for everyone" ON funnel_nodes FOR ALL USING (true) WITH CHECK (true);
-- Edges
CREATE POLICY "Enable all for everyone" ON funnel_edges FOR ALL USING (true) WITH CHECK (true);
