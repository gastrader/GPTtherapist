
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profilequeryRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    queryName: protectedProcedure.query(async ({ ctx }) => {
        const name = await ctx.prisma.user.findUnique({
            where:{
                id: ctx.session.user.id,
            },
            select: {
                name: true,
                age: true,
                gender: true,
                bio: true,
            }
        })
        return name;
    },)
});
