-- Création de la table pharmacies
CREATE TABLE IF NOT EXISTS pharmacies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  opening_hours JSONB NOT NULL DEFAULT '{}',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches géographiques
CREATE INDEX IF NOT EXISTS idx_pharmacies_location ON pharmacies (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_pharmacies_active ON pharmacies (is_active);
CREATE INDEX IF NOT EXISTS idx_pharmacies_name ON pharmacies (name);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_pharmacies_updated_at ON pharmacies;
CREATE TRIGGER update_pharmacies_updated_at
    BEFORE UPDATE ON pharmacies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Données d'exemple
INSERT INTO pharmacies (name, address, phone, opening_hours, latitude, longitude, image_url) VALUES
('Pharmacie Centrale', 'Avenue Mohammed V, Harhoura', '+212 537 123 456', 
 '{"lun": {"open": "08:00", "close": "20:00"}, "mar": {"open": "08:00", "close": "20:00"}, "mer": {"open": "08:00", "close": "20:00"}, "jeu": {"open": "08:00", "close": "20:00"}, "ven": {"open": "08:00", "close": "20:00"}, "sam": {"open": "09:00", "close": "18:00"}, "dim": {"closed": true}}',
 33.9716, -6.8498, '/placeholder.svg?height=200&width=300'),
 
('Pharmacie Al Amal', 'Rue des Palmiers, Harhoura', '+212 537 789 012', 
 '{"lun": {"open": "09:00", "close": "19:00"}, "mar": {"open": "09:00", "close": "19:00"}, "mer": {"open": "09:00", "close": "19:00"}, "jeu": {"open": "09:00", "close": "19:00"}, "ven": {"open": "09:00", "close": "19:00"}, "sam": {"open": "10:00", "close": "17:00"}, "dim": {"closed": true}}',
 33.9720, -6.8505, '/placeholder.svg?height=200&width=300'),
 
('Pharmacie du Port', 'Port de Harhoura', '+212 537 345 678', 
 '{"lun": {"open": "08:30", "close": "19:30"}, "mar": {"open": "08:30", "close": "19:30"}, "mer": {"open": "08:30", "close": "19:30"}, "jeu": {"open": "08:30", "close": "19:30"}, "ven": {"open": "08:30", "close": "19:30"}, "sam": {"open": "09:00", "close": "18:00"}, "dim": {"open": "10:00", "close": "16:00"}}',
 33.9710, -6.8490, '/placeholder.svg?height=200&width=300');

-- Politique de sécurité RLS (Row Level Security)
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique
CREATE POLICY "Pharmacies are viewable by everyone" ON pharmacies
  FOR SELECT USING (is_active = true);

-- Politique pour les administrateurs (à adapter selon votre système d'auth)
CREATE POLICY "Pharmacies are editable by admins" ON pharmacies
  FOR ALL USING (auth.role() = 'authenticated');
