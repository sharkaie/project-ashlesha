import { getSession } from "~/session.server";
import { json } from "@remix-run/node";
import { Cart } from "~/types/cart";

export const GetUserSessionCart = async (request: Request) => {
    const session = await getSession(request.headers.get("Cookie"));
    const sessionId = session.get("__sid");
    if (!sessionId) {
        return json([]);
    }

    const res = await fetch(
        `https://api.ashleshajewells.com/api/cart/${sessionId}`,
    );
    const data: Cart = res.ok ? await res.json() : [];
    return json({ cart: data, sessionId });
};
