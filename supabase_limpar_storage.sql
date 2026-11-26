-- ============================================================================
-- LIMPEZA TOTAL DO SUPABASE STORAGE (ZERA O USO DE 1 GB PARA 0 MB)
-- Todas as 172 fotos atuais já foram comprimidas e migradas para o CDN do Cloudflare Pages (/storage-cdn/...).
-- Execute este comando no SQL Editor do Supabase: https://supabase.com/dashboard/project/qhaoibxvujwzadcglrpq/sql/new
-- ============================================================================

-- 1. Liberar permissão de DELETE e UPDATE no bucket 'fotos' para o painel /admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin pode deletar fotos do storage'
  ) THEN
    CREATE POLICY "Admin pode deletar fotos do storage"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'fotos' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin pode atualizar fotos do storage'
  ) THEN
    CREATE POLICY "Admin pode atualizar fotos do storage"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'fotos' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- 2. Esvaziar 100% dos arquivos pesados antigos do bucket 'fotos' no Supabase Storage
-- (As 172 fotos do site já estão salvas e servidas diretamente pelo Cloudflare Pages CDN!)
DELETE FROM storage.objects WHERE bucket_id = 'fotos';
