/** @format */

export async function load({ params, parent, depends }) {
  const { supabase, session } = await parent();

  if (!session) return;

  let IS_DEBUG = false;

  let following;

  const { data: followingRecords } = await supabase
  .from('profile_follow')
  .select('*')
  .match({ sender_profile_id: session.user.id });

  IS_DEBUG && console.log('followingRecords', followingRecords);
  following = followingRecords;
  const followingIds = following.map(f => f.receiver_profile_id);

  let posts;

  const { data: postRecords } = await supabase
  .from('post')
  .select('*, profile_id (*)')
  .in('profile_id', followingIds)
  .match({ is_hidden: false })
  .order('created_at', { ascending: false });

  IS_DEBUG && console.log('postRecords', postRecords);
  posts = postRecords;
  const postIds = posts.map(p => p.id);

  let buys;

  const { data: profileBuyRecords } = await supabase
  .from('profile_buy')
  .select('*')
  .in('post_id', postIds)
  .match({ profile_id: session.user.id });

  IS_DEBUG && console.log('profileBuyRecords', profileBuyRecords);
  buys = profileBuyRecords;

  let shares;

  const { data: profileShareRecords } = await supabase
  .from('profile_share')
  .select('*')
  .in('post_id', postIds)
  .match({ receiver_profile_id: session.user.id, status: 'CONFIRMED' });

  IS_DEBUG && console.log('profileShareRecords', profileShareRecords);
  shares = profileShareRecords;

  posts.forEach(p => {
    p.isBought = buys.find(b => b.post_id === p.id);
    p.isShared = shares.find(s => s.post_id === p.id);
  });

  return {
    posts,
  };
}
