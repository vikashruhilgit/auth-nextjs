import { cookies } from "next/headers";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import { redirect } from "next/navigation";

const { default: db } = require("./db");

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});
const auth = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const createAuthSession = async (id) => {
  const session = await auth.createSession(id, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export const verifyAuth = async () => {
  const sessionCookie = cookies().get(auth.sessionCookieName);
  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await auth.validateSession(sessionId);
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = auth.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = auth.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}
  return result;
};

export const removeSession = async () => {
  const { session } = await verifyAuth();
  if (!session.id) {
    return {
      error: "Unauthorized",
    };
  }
  await auth.invalidateSession(session.id);
  try {
    const sessionCookie = auth.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch {}
};
