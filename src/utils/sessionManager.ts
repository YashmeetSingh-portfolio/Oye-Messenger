import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

const SESSION_KEY = "SUPABASE_SESSION";

/** Save current session securely */
export async function saveSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  }
}

/** Try to restore session if supabase.auth.getSession() returns null */
export async function restoreSession() {
  try {
    const saved = await SecureStore.getItemAsync(SESSION_KEY);
    if (saved) {
      const session = JSON.parse(saved);
      // restore into supabase (so other parts of app can access it)
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      return session;
    }
  } catch (e) {
    console.warn("No saved session found or failed to restore:", e);
  }
  return null;
}

/** Clear cached session (optional) */
export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
