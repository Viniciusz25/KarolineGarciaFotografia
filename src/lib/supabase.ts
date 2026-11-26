import { createClient } from "@supabase/supabase-js";
import cdnManifest from "./cdn-manifest.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const CDN_MANIFEST: Record<string, string> = cdnManifest;

function rewriteCdnUrls(obj: any): any {
  if (typeof obj === "string") {
    return CDN_MANIFEST[obj] || obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(rewriteCdnUrls);
  }
  if (obj && typeof obj === "object") {
    const out: Record<string, any> = {};
    for (const k of Object.keys(obj)) {
      out[k] = rewriteCdnUrls(obj[k]);
    }
    return out;
  }
  return obj;
}

const customFetch: typeof fetch = async (input, init) => {
  const res = await fetch(input, init);
  const urlStr =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;
  const method = (init?.method || "GET").toUpperCase();

  if (method === "GET" && urlStr.includes("/rest/v1/") && res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const cloned = res.clone();
        const data = await cloned.json();
        const rewritten = rewriteCdnUrls(data);
        return new Response(JSON.stringify(rewritten), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        });
      } catch {
        return res;
      }
    }
  }
  return res;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: customFetch },
});
