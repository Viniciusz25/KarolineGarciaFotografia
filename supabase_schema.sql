-- Criação da Tabela de Fotos
CREATE TABLE public.photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL,
  category text NOT NULL CHECK (category IN ('social', 'pet')),
  title text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança:
-- 1. Qualquer pessoa pode LER as fotos (Acesso Público)
CREATE POLICY "Fotos são públicas para visualização" 
ON public.photos FOR SELECT 
USING (true);

-- 2. Apenas usuários autenticados (Admin) podem INSERIR, ATUALIZAR ou DELETAR
CREATE POLICY "Apenas admin pode modificar fotos" 
ON public.photos FOR ALL 
USING (auth.role() = 'authenticated');
