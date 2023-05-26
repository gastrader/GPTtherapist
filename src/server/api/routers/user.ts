
import {
    createTRPCRouter,
    protectedProcedure,
    // publicProcedure
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    // me: publicProcedure.query(async ({ctx}) => {
    //     if (!ctx.session?.user) {
    //         return null
    //     }

    //     return ctx.prisma.user.findUnique({
    //         where: {
    //             id: ctx.session.user.id
    //         }
    //     })
    // }),
    getCredits: protectedProcedure.query(async ({ ctx }) =>{
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
        })

        
        if (user) {
            return user.credits as number;
        }
    }),
});
