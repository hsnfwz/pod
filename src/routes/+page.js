/** @format */

export async function load({ params, parent, depends }) {
  const { supabase, session } = await parent();

  if (!session) return;

  let IS_DEBUG = false;

  let posts;

  const { data: postRecords } = await supabase
  .from('feed_view')
  .select('*, profile_id (*)')
  .match({ sender_profile_id: session.user.id })
  .order('created_at', { ascending: false });

  IS_DEBUG && console.log('postRecords', postRecords);

  posts = postRecords || [];

  return {
    posts,
  };
}
