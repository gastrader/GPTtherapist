/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import fs from "fs";

export const chatqueryRouter = createTRPCRouter({
  //mutation = insert/delete or modify state of server
  //query = get data back
  queryChat: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        date: z.date(),

        //intentionally using mutate instead of query so that it can be called inside "onSubmit"
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.id) return;
      const oldDate = new Date(input.date);
      const dbDate = oldDate.toISOString();
      const nextDayDate = new Date(
        oldDate.setUTCDate(oldDate.getUTCDate() + 1)
      );
      const nextDate = nextDayDate.toISOString();

      const chats = await ctx.prisma.conversation.findMany({
        where: {
          userId: ctx.session.user.id,
          mode: input.type,
          createdAt: {
            gte: dbDate,
            lt: nextDate,
          },
        },

        orderBy: {
          updatedAt: "desc",
        },

        include: {
          messages: true,
        },
      });

      return chats;
    }),
  convoFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const convo = await ctx.prisma.message.findMany({
        where: {
          userId: ctx.session.user.id,
          conversationId: input.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });
      
      const formattedConvo = convo.map(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        (obj) => `${obj.user.name}: ${obj.prompt}\nTHERAPIST: ${obj.aiResponseText}`
      );

      const reformattedConvo = convo
        .map(
          (obj) =>
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${obj.user.name}: ${obj.prompt}\nTHERAPIST: ${obj.aiResponseText}`
        ).join("\n");        

      // fs.writeFile(`./tmp/${input.id}_conversation.txt`, reformattedConvo, (err) => {
      //   if (err) throw err;
      //   console.log("File is created successfully.");
      // }); 
      return reformattedConvo;
    }),
});
