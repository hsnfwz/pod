/** @format */

export async function load({ params, parent, depends }) {
  const { supabase, session } = await parent();

  let IS_DEBUG = false;

  let posts;

  if (!session) return { profile: undefined };

  const { data: postRecords } = await supabase
  .from('feed_view')
  .select('*, profile_id (*)')
  .match({ sender_profile_id: session.user.id })
  .order('created_at', { ascending: false });

  IS_DEBUG && console.log('postRecords', postRecords);

  posts = postRecords;

  depends('app:feed');

  return {
    posts,
  };
}
