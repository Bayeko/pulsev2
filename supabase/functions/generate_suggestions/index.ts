
/**
 * Basic suggestion generator used by the edge function.
 * Accepts an optional mood and returns activity suggestions.
 */
export function generateSuggestions({ mood }: { mood?: string }): string[] {
  if (mood === 'happy') {
    return ['Celebrate with friends', 'Share your joy'];
  }
  return ['Take a walk', 'Call a friend'];
}

// Edge runtime entry point for Supabase (Deno style)
export default async function handler(req: Request): Promise<Response> {
  const body = await req.json().catch(() => ({}));
  const suggestions = generateSuggestions(body);
  return new Response(JSON.stringify({ suggestions }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function generateSuggestions(req: Request): Promise<Response> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { pair_id } = await req.json();
  if (!pair_id) {
    return new Response(JSON.stringify({ error: "pair_id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const { data: busy, error } = await supabase
    .from("calendar_busy")
    .select("start_time,end_time")
    .eq("pair_id", pair_id)
    .gte("end_time", startOfDay.toISOString())
    .lt("start_time", endOfDay.toISOString())
    .order("start_time", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const free: { start: string; end: string }[] = [];
  let cursor = startOfDay;

  for (const slot of busy ?? []) {
    const busyStart = new Date(slot.start_time);
    const busyEnd = new Date(slot.end_time);

    if (cursor < busyStart) {
      free.push({ start: cursor.toISOString(), end: busyStart.toISOString() });
    }

    if (cursor < busyEnd) {
      cursor = busyEnd;
    }
  }

  if (cursor < endOfDay) {
    free.push({ start: cursor.toISOString(), end: endOfDay.toISOString() });
  }

  return new Response(JSON.stringify({ slots: free }), {
    headers: { "Content-Type": "application/json" },
  });
}

serve(generateSuggestions);

