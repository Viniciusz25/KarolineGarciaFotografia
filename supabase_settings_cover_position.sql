-- Adicionar coluna para controlar a posição da imagem (object-position) na tabela site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS cover_position text DEFAULT '50% 50%';
