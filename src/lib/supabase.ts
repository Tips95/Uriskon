import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hpbhmdlkcqieacapemnu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwYmhtZGxrY3FpZWFjYXBlbW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjE0NTIsImV4cCI6MjA2Mzg5NzQ1Mn0.Ozzv2pVN8stS2K_duGacRqbiVrQerX4Dpgzs5zhEuE0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
}); 