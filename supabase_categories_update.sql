-- 1. Remove restrições fixas nas tabelas atuais
ALTER TABLE public.photos DROP CONSTRAINT IF EXISTS photos_category_check;
ALTER TABLE public.albums DROP CONSTRAINT IF EXISTS albums_category_check;

-- 2. Cria a tabela de Categorias
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  description text,
  theme text DEFAULT 'dark', -- 'dark' ou 'light' para a página de ensaios
  cover_url text, -- Foto da seção (hero) ou do mosaico
  is_hidden boolean DEFAULT false, -- Opção para ocultar a categoria do site
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Categorias são públicas para visualização" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Apenas admin pode modificar categorias" 
ON public.categories FOR ALL 
USING (auth.role() = 'authenticated');

-- 3. Insere as categorias principais padrão (Social e Pet)
INSERT INTO public.categories (id, name, slug, theme, description, cover_url) VALUES 
('11111111-1111-1111-1111-111111111111', 'Fotografia Social', 'social', 'dark', 'Histórias reais, sentimentos verdadeiros e momentos que merecem ser eternizados com sensibilidade e elegância.', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2000&auto=format&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Fotografia Pet', 'pet', 'light', 'Personalidade, amor e conexão em cada clique. Seu melhor amigo merece fotos tão inesquecíveis quanto os momentos que vocês vivem juntos.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop');

-- 4. Insere as subcategorias filhas padrão (Social)
INSERT INTO public.categories (name, slug, parent_id, cover_url) VALUES
('Casamentos', 'casamentos', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2070&auto=format&fit=crop'),
('Debutantes', 'debutantes', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1000&auto=format&fit=crop'),
('Gestantes', 'gestantes', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop'),
('Família', 'familia', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop'),
('Casais', 'casais', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2070&auto=format&fit=crop'),
('Formaturas', 'formaturas', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop'),
('Eventos', 'eventos', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop');

-- 5. Insere as subcategorias filhas padrão (Pet)
INSERT INTO public.categories (name, slug, parent_id, cover_url) VALUES
('Ensaio Externo', 'externo', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2074&auto=format&fit=crop'),
('Estúdio', 'estudio', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop'),
('Pets e Família', 'pet-e-familia', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=2000&auto=format&fit=crop'),
('Filhotes', 'filhotes', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=2000&auto=format&fit=crop'),
('Datas Especiais', 'datas-especiais', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=2000&auto=format&fit=crop'),
('Aniversários Pet', 'aniversarios-pet', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=2000&auto=format&fit=crop');
