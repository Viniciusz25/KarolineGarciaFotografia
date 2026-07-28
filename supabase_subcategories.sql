-- Adiciona a coluna subcategory na tabela albums
ALTER TABLE albums 
ADD COLUMN subcategory text;

-- (Opcional) Você pode limpar os álbuns antigos ou eles apenas ficarão com a subcategory como NULL, o que não quebrará nada.
