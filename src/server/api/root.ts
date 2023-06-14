import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { generateRouter } from "~/server/api/routers/generate";
import { checkoutRouter } from "~/server/api/routers/checkout";
import { voiceRouter } from "~/server/api/routers/voice";
import { chatRouter } from "~/server/api/routers/chat";
import { profileRouter } from "~/server/api/routers/profileUpdate";
import { profilequeryRouter } from "~/server/api/routers/profileQuery";
import { notificationRouter } from "./routers/notificationUpdate";
import { notificationequeryRouter } from "./routers/notificationQuery";
import { chatqueryRouter } from "./routers/chatQuery";
import { convoRouter } from "./routers/newConvo";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  generate: generateRouter,
  checkout: checkoutRouter,
  chat: chatRouter,
  voice: voiceRouter,
  profile: profileRouter,
  profilequeryRouter: profilequeryRouter,
  notificationUpdate: notificationRouter,
  notificationequeryRouter: notificationequeryRouter,
  chatqueryRouter: chatqueryRouter,
  convoRouter: convoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
