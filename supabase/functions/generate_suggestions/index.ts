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
