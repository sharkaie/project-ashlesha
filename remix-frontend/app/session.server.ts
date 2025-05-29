import { createCookieSessionStorage } from "@remix-run/node";

// Define the type of session data
interface SessionData {
    __sid: string;
}

interface SessionFlashData {}

// Create a session storage object
export const sessionStorage = createCookieSessionStorage<
    SessionData,
    SessionFlashData
>({
    cookie: {
        name: "__sid", // Name of the cookie
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        secrets: [process.env.SESSION_SECRET!], // Use a secret to sign the cookie
        sameSite: "lax", // Protect against CSRF
        httpOnly: true, // Prevent client-side JS access
        path: "/", // Cookie is available site-wide
        maxAge: 60 * 60 * 24 * 30 * 6, // 6 months in seconds
    },
});

// Export helper functions for session management
export const { getSession, commitSession, destroySession } = sessionStorage;
