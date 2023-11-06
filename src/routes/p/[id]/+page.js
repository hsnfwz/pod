/** @format */

export async function load({ params, parent, depends }) {
  const { supabase, session } = await parent();

  let IS_DEBUG = false;

  let post;
  let postReplies = [];

  if (!session) return { post: undefined, postReplies };

  // get post
  const { data: postRecords } = await supabase
    .from('post')
    .select('*, profile_id (*)')
    .match({ id: params.id, is_hidden: false });

  post = postRecords[0];

  IS_DEBUG && console.log('postRecords', postRecords);

  // check if post exists
  if (!post) return { post: undefined, postReplies };

  // get post replies
  const { data: postReplyRecords } = await supabase
  .from('post')
  .select('*, profile_id (*)')
  .match({ parent_post_id: post.id, is_hidden: false })
  .order('created_at', { ascending: false });

  postReplies = postReplyRecords;

  IS_DEBUG && console.log('postReplyRecords', postReplyRecords);

  // if so, check if post belongs to profile
  if (post.profile_id.id === session.user.id) return { post, postReplies };

  // if not, check if profile bought post
  const { data: profileBuyRecords } = await supabase
    .from('profile_buy')
    .select('*')
    .match({ profile_id: session.user.id, post_id: post.id });

  IS_DEBUG && console.log('profileBuyRecords', profileBuyRecords);

  let profileBuy = profileBuyRecords[0];

  // check if profile activity exists
  if (!profileBuy) {
    // if not, check if profile was sent post
    const { data: profileShareRecords } = await supabase
      .from('profile_share')
      .select('*, sender_profile_id(*), receiver_profile_id(*)')
      .match({ receiver_profile_id: session.user.id, post_id: post.id });

    IS_DEBUG && console.log('profileShareRecords', profileShareRecords);

    let profileShare = profileShareRecords[0];

    // check if profile share exists
    if (!profileShare) return { post, postReplies };

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

  depends('app:postid');

  return {
    post,
    postReplies,
  };
}
