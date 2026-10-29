import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Lấy trực tiếp từ dự án Supabase của bạn
const supabaseUrl = 'https://eieokdpkfvfbtfoinnwj.supabase.co'
const supabaseKey = 'sb_publishable_YtyMtnhvROZ78yrMgtKAXw_7UprpiXM'

export const supabase = createClient(supabaseUrl, supabaseKey)