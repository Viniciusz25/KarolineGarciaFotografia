-- Criação da tabela de configurações
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  title text NOT NULL,
  section text NOT NULL,
  url text NOT NULL,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Leitura pública para site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Acesso total para usuários autenticados em site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Inserção dos dados padrão (Imagens ilustrativas atuais)
INSERT INTO site_settings (key, title, section, url) VALUES
('home_hero_bg', 'Capa Principal (Hero)', 'Home', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop'),
('home_escolha_social', 'Capa Escolha - Social', 'Home', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop'),
('home_escolha_pet', 'Capa Escolha - Pet', 'Home', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop'),
('home_sobre_mosaic_1', 'Mosaico Sobre 1 (Vertical Esq)', 'Home', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop'),
('home_sobre_mosaic_2', 'Mosaico Sobre 2 (Horizontal Sup)', 'Home', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop'),
('home_sobre_mosaic_3', 'Mosaico Sobre 3 (Quadrado Inf)', 'Home', 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop'),
('home_sobre_mosaic_4', 'Mosaico Sobre 4 (Vertical Dir)', 'Home', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop'),
('home_highlight_1', 'Destaque 1', 'Home', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop'),
('home_highlight_2', 'Destaque 2', 'Home', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop'),
('home_highlight_3', 'Destaque 3', 'Home', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop'),

('sobre_hero_bg', 'Capa Principal (Hero)', 'Sobre', 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2000&auto=format&fit=crop'),
('sobre_image_1', 'Foto História 1 (Retrato)', 'Sobre', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'),
('sobre_image_2', 'Foto História 2 (Paisagem)', 'Sobre', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop'),
('sobre_image_3', 'Foto Missão', 'Sobre', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop'),

('contato_hero_bg', 'Capa Principal (Hero)', 'Contato', 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2000&auto=format&fit=crop'),
('contato_studio', 'Foto do Estúdio', 'Contato', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000&auto=format&fit=crop'),

('ensaios_hero_bg', 'Capa Principal (Hero)', 'Ensaios', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2000&auto=format&fit=crop'),
('ensaios_mosaic_1', 'Mosaico 1 (Retrato)', 'Ensaios', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop'),
('ensaios_mosaic_2', 'Mosaico 2 (Paisagem)', 'Ensaios', 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1000&auto=format&fit=crop'),
('ensaios_mosaic_3', 'Mosaico 3 (Paisagem)', 'Ensaios', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop'),
('ensaios_mosaic_4', 'Mosaico 4 (Retrato)', 'Ensaios', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop'),

('portfolio_hero_bg', 'Capa Principal (Hero)', 'Portfólio', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000&auto=format&fit=crop'),
('portfolio_social_cover', 'Capa Sessão Social', 'Portfólio', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop'),
('portfolio_pet_cover', 'Capa Sessão Pet', 'Portfólio', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop'),

('portfolio_social_casamentos', 'Capa Categoria: Casamentos', 'Portfólio Social', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop'),
('portfolio_social_debutantes', 'Capa Categoria: 15 Anos', 'Portfólio Social', 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop'),
('portfolio_social_gestantes', 'Capa Categoria: Gestantes', 'Portfólio Social', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop'),
('portfolio_social_familia', 'Capa Categoria: Família', 'Portfólio Social', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop'),
('portfolio_social_casais', 'Capa Categoria: Casais', 'Portfólio Social', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop'),
('portfolio_social_formaturas', 'Capa Categoria: Formaturas', 'Portfólio Social', 'https://images.unsplash.com/photo-1523580494112-071d39285bf7?q=80&w=800&auto=format&fit=crop'),
('portfolio_social_eventos', 'Capa Categoria: Eventos', 'Portfólio Social', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop'),

('portfolio_pet_externo', 'Capa Categoria: Ensaio Externo', 'Portfólio Pet', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop'),
('portfolio_pet_estudio', 'Capa Categoria: Estúdio', 'Portfólio Pet', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop'),
('portfolio_pet_pet_e_familia', 'Capa Categoria: Pets e Família', 'Portfólio Pet', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop'),
('portfolio_pet_filhotes', 'Capa Categoria: Filhotes', 'Portfólio Pet', 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=800&auto=format&fit=crop'),
('portfolio_pet_datas_especiais', 'Capa Categoria: Datas Especiais', 'Portfólio Pet', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop'),
('portfolio_pet_aniversarios_pet', 'Capa Categoria: Aniversários Pet', 'Portfólio Pet', 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=800&auto=format&fit=crop'),
('portfolio_pet_gatos', 'Capa Categoria: Gatos', 'Portfólio Pet', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (key) DO NOTHING;
