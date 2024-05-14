/** @format */

export async function load({ params, parent, depends }) {
  const { supabase, session } = await parent();

  if (!session) return;

  let IS_DEBUG = false;

  const now = new Date().toISOString();

  let profileAbilitiesActive;
  let profileAbilitiesCooldown;

  const { data: profileAbilityActiveRecords } = await supabase
  .from('profile_ability')
  .select('*')
  .match({ profile_id: session.user.id })
  .gt('expired_at', now);

  IS_DEBUG && console.log('profileAbilityActiveRecords', profileAbilityActiveRecords);
  profileAbilitiesActive = profileAbilityActiveRecords;

  const { data: profileAbilityCooldownRecords } = await supabase
  .from('profile_ability')
  .select('*')
  .match({ profile_id: session.user.id })
  .lte('expired_at', now)
  .gt('renew_at', now)

  IS_DEBUG && console.log('profileAbilityCooldownRecords', profileAbilityCooldownRecords);
  profileAbilitiesCooldown = profileAbilityCooldownRecords;

  return {
    profileAbilitiesActive,
    profileAbilitiesCooldown,
  };
}
