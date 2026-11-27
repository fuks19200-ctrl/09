import { createClient } from "@supabase/supabase-js";
import config from "./account-config.json";

// Only a public/publishable browser key may be configured here.
export function createAccountClient() {
  const url=config.url.trim();
  const key=config.publishableKey.trim();
  if (!url || !key || !key.startsWith("sb_publishable_")) return null;
  return createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:"multum-shop-auth-v1"}});
}
