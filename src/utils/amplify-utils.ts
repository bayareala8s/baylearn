import { cookies } from "next/headers";
import outputs from "../../amplify_outputs.json";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import type { Schema } from "../../amplify/data/resource";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth/server";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function getServerUserAndGroups() {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });

    const session = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchAuthSession(contextSpec),
    });

    const groups =
      (session.tokens?.accessToken?.payload["cognito:groups"] as string[] | undefined) ?? [];

    return {
      userSub: user.userId,
      username: user.username,
      groups,
      isAdmin: groups.includes("Admin"),
    };
  } catch {
    return null;
  }
}
