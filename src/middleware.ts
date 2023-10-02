import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/speech",
    "/about",
    "/for-companies",
    "/pricing",
    "/api/webhook",
    "/api/stripe_webhook",
    // "/interview-creator",
    // "/api/trpc/industries.getAll",
    // "/api/trpc/topic.getTopicsByIndustryId",
    // "/api/trpc/interview.create",
    // "/api/trpc/azure.getToken",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
