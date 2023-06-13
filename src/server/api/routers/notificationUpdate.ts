
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    notificationUpdate: protectedProcedure.input(
        z.object({
            comms: z.boolean(),
            marketing: z.boolean(),
        })
    ).mutation(async ({ ctx, input }) => {
        console.log("USER INPUT:", input.comms, input.marketing);

        //verify user has enough credits.
        await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                communication_emails: {
                    set: input.comms
                },
                marketing_emails: {
                    set: input.marketing
                }
            }
        });
        console.log("notifications should be set!")
        return {
            message: "success",
        }
    }),
});
