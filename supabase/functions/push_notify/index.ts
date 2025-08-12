import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const { record } = await req.json();
  const profileId = record.receiver_id as string;

  const { data, error } = await supabase
    .from("profiles")
    .select("expo_push_token")
    .eq("id", profileId)
    .single();

  if (error || !data?.expo_push_token) {
    return new Response(
      JSON.stringify({ error: "missing push token" }),
      { status: 200 },
    );
  }

  const message = {
    to: data.expo_push_token,
    sound: "default",
    body: "Open the app to view your notification",
    data: { pulse_id: record.id },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
