import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.body ?? {};

  if (!key || key !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  const { error } = await supabase
    .from('events')
    .delete()
    .neq('id', 0); // briše sve retke

  if (error) {
    console.error('Supabase delete error:', error);
    return res.status(500).json({ error: 'Failed to reset events' });
  }

  return res.status(200).json({ ok: true });
}
