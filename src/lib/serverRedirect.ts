import { ObjectId } from "mongodb";
import { NextPageContext } from "next";
import cookies from "next-cookies";

export default function serverRedirect(ctx: NextPageContext, fn: (cookies: Record<string, string>) => void) {
    const cookiesList = cookies(ctx);
    const { accessToken, refreshToken, user_id } = cookiesList;
    if (!accessToken || !refreshToken || !ObjectId.isValid(user_id)) {
        return redirect(ctx);
    } else {
        return fn(cookiesList);
    }
}
export function redirect(ctx: NextPageContext) {
    return {
        redirect: {
            permanent: false,
            destination: "/login?to=" + ((ctx as any).resolvedUrl || encodeURIComponent(ctx.req.url)),
            basePath: true,
        }
    }
}
export function defaultRedirect(ctx: NextPageContext) {
    return serverRedirect(ctx, () => ({ props: {} }));
}