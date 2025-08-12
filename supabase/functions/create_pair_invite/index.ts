import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Edge function that generates a random 6 digit code and stores it in the
 * `pair_invites` table. Returns the created code to the caller.
 */
serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const { error } = await supabase.from('pair_invites').insert({ code });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ code }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
