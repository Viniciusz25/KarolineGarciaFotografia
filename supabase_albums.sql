-- 1. Criação da Tabela de Ensaios (Álbuns)
CREATE TABLE public.albums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('social', 'pet')),
  cover_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Atualizar a tabela 'photos' para permitir que uma foto pertença a um álbum
-- Adicionando a coluna album_id (pode ser nula, significando 'foto solta')
ALTER TABLE public.photos 
ADD COLUMN album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE;

-- 3. Habilitar RLS na nova tabela
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de segurança para a tabela de albums
-- Acesso Público para leitura
CREATE POLICY "Ensaios são públicos para visualização" 
ON public.albums FOR SELECT 
USING (true);

-- Apenas Admin para criação/edição/deleção
CREATE POLICY "Admin pode tudo nos ensaios" 
ON public.albums FOR ALL 
USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');
