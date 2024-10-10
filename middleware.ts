import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // 未登录时重定向到的登录页面
    },
});

export const config = {
    matcher: [
        "/cart",
        "/orders",
        "/orders/:path*",
        "/wishlist",
    ], // 保护 /dashboard 路由及其子路由
};