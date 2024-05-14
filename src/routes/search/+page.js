/** @format */

const columnSort = {
  'Latest': 'created_at',
  'Buys': 'buy_count',
  'Shares': 'share_count',
  'Replies': 'reply_count',
  'Gifts': 'gift_count'
}

const today = new Date();
today.setHours(0,0,0,0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0,0,0,0);

const week = new Date(today);
week.setDate(week.getDate() - 7);
week.setHours(0,0,0,0);

const month = new Date(today);
month.setMonth(month.getMonth() - 1);
month.setHours(0,0,0,0);

const year = new Date(today);
year.setFullYear(year.getFullYear() - 1);
year.setHours(0,0,0,0);

const dateSort = {
  'Today': {
    gte: today.toDateString(),
    lt: tomorrow.toDateString(),
  },
  'This Week': {
    gte: week.toDateString(),
    lt: tomorrow.toDateString(),
  },
  'This Month': {
    gte: month.toDateString(),
    lt: tomorrow.toDateString(),
  },
  'This Year': {
    gte: year.toDateString(),
    lt: tomorrow.toDateString(),
  },
  'All Time': {
    gte: new Date(null).toDateString(),
    lt: tomorrow.toDateString(),
  },
}

export async function load({ params, parent, depends, url }) {
  const { supabase, session } = await parent();

  // let sortParam = url.searchParams.get('sort');
  // let dateParam = url.searchParams.get('date');

  let IS_DEBUG = false;

  // let posts;
  // let profiles;

  if (!session) return { posts: [] };

  // let _order = {
  //   column: columnSort[sortParam] || columnSort['Latest'],
  //   ascending: false,
  // }

  // let _gte = {
  //   column: 'created_at',
  //   gt: dateSort[dateParam] ? dateSort[dateParam].gte : dateSort['Today'].gte,
  // }

  // let _lt = {
  //   column: 'created_at',
  //   lt: dateSort[dateParam] ? dateSort[dateParam].lt : dateSort['Today'].lt,
  // }

  // if (columnSort[sortParam]) {
  //   const { data: postRecords } = await supabase
  //   .from('post')
  //   .select('*, profile_id (*)')
  //   .match({ is_hidden: false })
  //   .gte(_gte.column, _gte.gt)
  //   .lt(_lt.column, _lt.lt)
  //   .order(_order.column, { ascending: _order.ascending })
  
  //   IS_DEBUG && console.log('postRecords', postRecords);
  
  //   posts = postRecords;
  // } else {
  //   const { data: postRecords } = await supabase
  //   .from('post')
  //   .select('*, profile_id (*)')
  //   .match({ is_hidden: false })
  //   .gte('created_at', dateSort['Today'].gte)
  //   .lt('created_at', dateSort['Today'].lt)
  //   .order('created_at', { ascending: false })
  
  //   IS_DEBUG && console.log('postRecords', postRecords);
  
  //   posts = postRecords;
  // }


  let posts;
  let profiles;

  const { data: postRecords } = await supabase
  .from('post')
  .select('*, profile_id (*)')
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

  const { data: profileRecords } = await supabase
  .from('profile')
  .select('*')
  .order('follower_count', { ascending: false });

  IS_DEBUG && console.log('profileRecords', profileRecords);

  profiles = profileRecords;

  return {
    posts,
    profiles
  };
}
