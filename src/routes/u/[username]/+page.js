/** @format */

export async function load({ params, parent, depends }) {
  const { supabase, session } = await parent();

  if (!session) return;

  let IS_DEBUG = false;

  let profile = undefined;

  const { data: profileRecords } = await supabase
    .from('profile')
    .select('*')
    .match({ username: params.username });

  IS_DEBUG && console.log('profileRecords', profileRecords);

  profile = profileRecords[0];

  if (!profile) return { profile };

  const { data: profileFollowingRecords } = await supabase
  .from('profile_follow')
  .select('*')
  .match({ sender_profile_id: session.user.id, receiver_profile_id: profile.id });

  IS_DEBUG && console.log('profileFollowingRecords', profileFollowingRecords);

  profile.isFollowing = profileFollowingRecords[0];

  const { data: profileFollowerRecords } = await supabase
  .from('profile_follow')
  .select('*')
  .match({ sender_profile_id: profile.id, receiver_profile_id: session.user.id });

  IS_DEBUG && console.log('profileFollowerRecords', profileFollowerRecords);

  profile.isFollower = profileFollowerRecords[0];

  const { data: postRecords } = await supabase
    .from('post')
    .select('*, profile_id (*)')
    .match({ profile_id: profile.id, is_hidden: false })
    .order('created_at', { ascending: false })

  IS_DEBUG && console.log('postRecords', postRecords);

  let posts = postRecords;

  const { data: followerRecords } = await supabase
  .from('profile_follow')
  .select('*, sender_profile_id (*)')
  .match({ status: 'CONFIRMED', receiver_profile_id: profile.id })
  .order('created_at', { ascending: false })

  IS_DEBUG && console.log('followerRecords', followerRecords);

  let followers = followerRecords;

  const { data: followingRecords } = await supabase
  .from('profile_follow')
  .select('*, receiver_profile_id (*)')
  .match({ status: 'CONFIRMED', sender_profile_id: profile.id })
  .order('created_at', { ascending: false })

  IS_DEBUG && console.log('followingRecords', followingRecords);

  let following = followingRecords;

  return {
    profile,
    posts,
    followers,
    following,
  }
}