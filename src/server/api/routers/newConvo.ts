/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const convoRouter = createTRPCRouter({

    newConversation: protectedProcedure.mutation(async ({ ctx }) => {
        
        // console.log("inside the newconvo TRPC----------------------------")
        const activeConvo = await ctx.prisma.conversation.findFirst({
            where: {
                userId: ctx.session.user.id,
                status: 'active'
            },
            orderBy: { createdAt: 'desc'}
        });

        if (activeConvo){
            // console.log("The current active chat ID is: ", activeConvo.id)
            const setInactive = await ctx.prisma.conversation.update({
                where: {id: activeConvo.id},
                data: {status: 'inactive'},
            });
            console.log("We just set it inactive: ", setInactive.id)
        }

        const newConversation = await ctx.prisma.conversation.create({
            data: {
                user: { connect: { id: ctx.session.user.id } },
                status: 'active',
                createdAt: new Date(),
                },
                });
        // console.log("The new active convo ID is: ", newConversation.id)

    // Return the new conversation ID
    return { conversationId: newConversation.id };
}),})
