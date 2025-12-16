'use server';

import { getServerUserAndGroups } from '@/utils/amplify-utils';

export async function getServerUser() {
  const u = await getServerUserAndGroups();
  if (!u) throw new Error('Not authenticated');
  return u;
}
