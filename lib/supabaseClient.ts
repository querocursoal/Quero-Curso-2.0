
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lnzdkvutxckvhwrsddfz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuemRrdnV0eGNrdmh3cnNkZGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0OTA5MTYsImV4cCI6MjA4NDA2NjkxNn0.gghFaD1DvnaoxW9EM8JtiyLzC3NZgw9kV6QtrUsC_bo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
