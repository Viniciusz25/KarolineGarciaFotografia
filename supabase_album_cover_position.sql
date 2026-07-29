-- Adicionar coluna para controlar a posição da imagem de capa (object-position)
ALTER TABLE public.albums 
ADD COLUMN IF NOT EXISTS cover_position text DEFAULT 'center';
