import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Create Supabase client
const supabase = createClient(env.supabase_project_url, env.supabase_api_key);

export default supabase;
