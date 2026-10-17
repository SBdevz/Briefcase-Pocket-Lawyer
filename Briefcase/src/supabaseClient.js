import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccojembnczonheqbmxkl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjb2plbWJuY3pvbmhlcWJteGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxOTcyMjMsImV4cCI6MjEwNzc3MzIyM30.K_vLsvZM47ZDDnfaHiM4Xt5vIgKmbfTdQICXdfWzUhU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
