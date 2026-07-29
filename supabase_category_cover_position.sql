-- Adicionar coluna para controlar a posição da imagem de capa (object-position) nas categorias
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS cover_position text DEFAULT 'center';
