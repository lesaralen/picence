import { createClient } from '@supabase/supabase-js';

const ALLOWED_TYPES = new Set([
  'page_open',
  'no_attempt',
  'clicked_yes',
  'slot_selected',
  'confirmed',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data } = req.body ?? {};

  if (!type || !ALLOWED_TYPES.has(type)) {
    return res.status(400).json({ error: 'Invalid event type' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  const { error } = await supabase
    .from('events')
    .insert({ type, data: data ?? null });

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to store event' });
  }

  return res.status(200).json({ ok: true });
}
