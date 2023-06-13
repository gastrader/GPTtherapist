/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const chatqueryRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    queryChat: protectedProcedure.input(
        z.object({
            type: z.string(),
            date: z.date(),
            
    //intentionally using mutate instead of query so that it can be called inside "onSubmit"
    })).mutation(async ({ ctx, input }) => {
        let selectedFields = {};
        
        if (input.type == "chat") {
            selectedFields = {
                text_ai_response:true,
                text_prompt: true,
            }
        } else if (input.type == "video"){
            selectedFields = {
                video_ai_response:true,
                video_prompt:true,
            }
        }
        
        const oldDate = new Date(input.date)
        const dbDate = oldDate.toISOString();
        const nextDayDate = new Date(oldDate.setUTCDate(oldDate.getUTCDate() + 1));
        const nextDate = nextDayDate.toISOString();
        
        console.log("The updated date is: ",dbDate);
        console.log("the next date is: ", nextDate);
        let chats = await ctx.prisma.message.findMany({
            where: {
                userId: ctx.session.user.id,
                createdAt: {
                    gte: dbDate,
                    lt: nextDate ,
                }
            },
            select: selectedFields,
        });
        chats = chats.map((chat) => {
            const chatAsIndexable = chat as { [key: string]: any };
            Object.keys(chatAsIndexable).forEach((key) => {
                if (chatAsIndexable[key] === null) {
                    delete chatAsIndexable[key];
                }
            });
            return chatAsIndexable;
        });
        chats = chats.filter((chat) => Object.keys(chat).length > 0)
        console.log(chats)
        return chats;
    }),
});
