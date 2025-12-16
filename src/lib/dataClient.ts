import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

/**
 * Browser/client-side Data client.
 * Server Components should use `cookiesClient` from src/utils/amplify-utils.ts
 */
export function clientData() {
  return generateClient<Schema>();
}
