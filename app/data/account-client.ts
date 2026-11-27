import { createClient } from "@supabase/supabase-js";
import config from "./account-config.json";

// Only a public/publishable browser key may be configured here.
export function createAccountClient() {
  const url=config.url.trim();
  const key=config.publishableKey.trim();
  if (!url || !key || !key.startsWith("sb_publishable_")) return null;
  return createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:"multum-shop-auth-v1"}});
}


// Do not send a signup confirmation email if the requested password-only mode
// is not enabled in the shop project's Auth settings.
export async function canSignUpWithoutConfirmation(): Promise<boolean> {
  const response = await fetch(config.url.replace(/\/$/,"")+"/auth/v1/settings", {
    headers: { apikey: config.publishableKey },
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Auth settings unavailable");
  const settings = await response.json();
  return settings.mailer_autoconfirm === true && settings.disable_signup === false && settings.external?.email === true;
}
