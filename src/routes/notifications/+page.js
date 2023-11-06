/** @format */

export async function load({ params, parent, depends }) {
  const { supabase, session } = await parent();

  let IS_DEBUG = false;

  if (!session) return { profile: undefined };

  const { data: profileFollowRecords } = await supabase
    .from('profile_follow')
    .select('*, sender_profile_id (*)')
    .match({ receiver_profile_id: session.user.id })
    .order('created_at', { ascending: false });

  IS_DEBUG && console.log('profileFollowRecords', profileFollowRecords);

  const { data: profileShareRecords } = await supabase
    .from('profile_share')
    .select('*, sender_profile_id (*)')
    .match({ receiver_profile_id: session.user.id })
    .order('created_at', { ascending: false });

  IS_DEBUG && console.log('profileShareRecords', profileShareRecords);

  const { data: profileGiftRecords } = await supabase
  .from('profile_gift')
  .select('*, sender_profile_id (*)')
  .match({ receiver_profile_id: session.user.id })
  .order('created_at', { ascending: false });

  IS_DEBUG && console.log('profileGiftRecords', profileGiftRecords);

  return {
    profileFollow: profileFollowRecords,
    profileShare: profileShareRecords,
    profileGift: profileGiftRecords,
  };
}
