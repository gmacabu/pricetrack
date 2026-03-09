import { createClient } from '@supabase/supabase-js';

// ⚠️ SUBSTITUA pelos valores do SEU projeto Supabase
// Você encontra estes valores em: Supabase → Settings → API
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'COLE_SUA_URL_AQUI';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'COLE_SUA_CHAVE_AQUI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
