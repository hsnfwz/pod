import {
  PRIVATE_CRON_SECRET
} from '$env/static/private';

export const GET = async (req, res) => {
  if (req.headers.get('Authorization') !== `Bearer ${PRIVATE_CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  await req.locals.supabase.rpc('daily_coins', { increment_amount: 10 });

  return new Response('Daily Coins Sent!');
}