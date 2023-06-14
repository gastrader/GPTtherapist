import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getChatResponse, s3PutBase64 } from "../../utils";
import { createAIVideoResponse } from "../../createAIVideoResponse";

const CONVERSATION_CREATE_CREDITS = 10;
const CONVERSATION_REPLY_CREDITS = 8;

export const conversationRouter = createTRPCRouter({
  createConversation: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        conversationType: z.enum(["TEXT", "VIDEO"]).default("VIDEO"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) return;

      const { session } = ctx;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user) return;

      if (user.credits < CONVERSATION_CREATE_CREDITS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You do not have enough credits. Needed: `,
        });
      }

      try {
        const conversation = await ctx.prisma.conversation.create({
          data: {
            mode: input.conversationType,
            subject: "default_subject_message",
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });

        if (input.conversationType === "VIDEO") {
          const { aiResponse, base64, clipId, resultUrl } =
            await createAIVideoResponse(input.message);

          const message = await ctx.prisma.message.create({
            data: {
              prompt: input.message,
              aiResponseText: aiResponse,
              aiResponseUrl: resultUrl, // this should be the bucket url ideally
              user: {
                connect: {
                  id: session.user.id,
                },
              },
              conversation: {
                connect: {
                  id: conversation.id,
                },
              },
            },
            include: {
              conversation: true,
            },
          });

          const bucketKey = `${session.user.id}-${conversation.id}-${message.id}`;

          s3PutBase64(base64, bucketKey);

          return message;
        }

        const aiResponse = await getChatResponse(input.message);
        const message = await ctx.prisma.message.create({
          data: {
            prompt: input.message,
            aiResponseText: aiResponse,
            user: {
              connect: {
                id: session.user.id,
              },
            },
            conversation: {
              connect: {
                id: conversation.id,
              },
            },
          },
          include: {
            conversation: true,
          },
        });
        return message;
      } catch (e) {
        console.log(e);
      }
    }),
});
