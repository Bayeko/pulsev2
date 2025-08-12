import type { Context } from 'hono';
import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';

const app = new Hono();

app.post('/', async (c: Context) => {
  const { user_id, api_key, entitlement } = await c.req.json();
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceRole);

  // Fetch entitlements from RevenueCat
  const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${user_id}`, {
    headers: {
      'X-Platform': 'web',
      'Authorization': `Bearer ${api_key}`
    }
  });
  const data = await response.json();
  const active = data.subscriber?.entitlements?.[entitlement];

  if (active) {
    await supabase.from('purchases').insert({ user_id, sku: active.product_identifier, synced_at: new Date().toISOString() });
  }

  return c.json({ ok: true });
});

export default app;
