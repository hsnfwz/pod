/** @format */

export async function load({ params, parent, depends }) {
  const { supabase, session } = await parent();

  if (!session) return;

  let IS_DEBUG = false;

  let post;
  let postReplies = [];
  let followers = [];

  const { data: postRecords } = await supabase
    .from('post')
    .select('*, profile_id (*)')
    .match({ id: params.id, is_hidden: false });

  post = postRecords[0];
  IS_DEBUG && console.log('postRecords', postRecords);

  if (!post) return;

  const { data: postReplyRecords } = await supabase
  .from('post')
  .select('*, profile_id (*)')
  .match({ parent_post_id: post.id, is_hidden: false })
  .order('created_at', { ascending: false });

  postReplies = postReplyRecords;
  IS_DEBUG && console.log('postReplyRecords', postReplyRecords);

  const { data: profileFollowRecords } = await supabase
  .from('profile_follow')
  .select('*, sender_profile_id (*)')
  .match({ status: 'CONFIRMED', receiver_profile_id: session.user.id })
  .order('created_at', { ascending: false });

  IS_DEBUG && console.log('profileFollowRecords', profileFollowRecords);
  followers = profileFollowRecords;

  if (post.profile_id.id === session.user.id) return { post, postReplies, followers };

  const { data: profileBuyRecords } = await supabase
    .from('profile_buy')
    .select('*')
    .match({ profile_id: session.user.id, post_id: post.id });

  IS_DEBUG && console.log('profileBuyRecords', profileBuyRecords);
  let profileBuy = profileBuyRecords[0];

  if (!profileBuy) {
    const { data: profileShareRecords } = await supabase
      .from('profile_share')
      .select('*, sender_profile_id(*), receiver_profile_id(*)')
      .match({ receiver_profile_id: session.user.id, post_id: post.id });

    IS_DEBUG && console.log('profileShareRecords', profileShareRecords);
    let profileShare = profileShareRecords[0];

    if (!profileShare) return { post, postReplies, followers: [] };

    post.isShared = profileShare;
  }

  // check if profile voted safe
  const { data: profileSafeRecords } = await supabase
  .from('profile_safe')
  .select('*')
  .match({ profile_id: session.user.id, post_id: post.id });

  IS_DEBUG && console.log('profileSafeRecords', profileSafeRecords);
  let profileSafe = profileSafeRecords[0];

  // if so, check if profile gifted post
  const { data: profileGiftRecords } = await supabase
    .from('profile_gift')
    .select('*')
    .match({ sender_profile_id: session.user.id, post_id: post.id });

  IS_DEBUG && console.log('profileGiftRecords', profileGiftRecords);
  let profileGift = profileGiftRecords[0];

  post.isBought = profileBuy;
  post.isGifted = profileGift;
  post.profileSafe = profileSafe;

  return {
    post,
    postReplies,
    followers,
  };
}
