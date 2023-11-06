/** @format */

// src/routes/+layout.js
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

export const load = async ({ fetch, data, depends }) => {
  depends('supabase:auth');

  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event: { fetch },
    serverSession: data.session,
  });

  let IS_DEBUG = false;

  let profile;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return { supabase, session, profile: undefined };

  const { data: profileRecords } = await supabase
    .from('profile')
    .select('*')
    .match({ id: session.user.id });

  IS_DEBUG && console.log('profileRecords', profileRecords);

  profile = profileRecords[0];

  session.profile = profile;

  return { supabase, session };
};
