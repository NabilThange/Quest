import { cache } from 'react';
import { createClient } from './server';

/**
 * Cached getUser — deduplicates the auth round-trip across layout + page
 * in the same React render tree. One network call per request.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});
