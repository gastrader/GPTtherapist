
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationequeryRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    notiQuery: protectedProcedure.query(async ({ ctx }) => {
        const noti = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                communication_emails: true,
                marketing_emails: true,
            }
        })
        return noti;
    },)
});
