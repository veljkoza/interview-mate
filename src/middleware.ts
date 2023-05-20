import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/for-companies",
    "/pricing",
    "/interview-creator",
    "/api/trpc/industries.getAll",
    "/api/trpc/topic.getTopicsByIndustryId",
    "/api/trpc/interview.create",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
