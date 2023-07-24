// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// export const convoRouter = createTRPCRouter({

//     newConversation: protectedProcedure.mutation(async ({ ctx }) => {
        
//         // console.log("inside the newconvo TRPC----------------------------")
//         const activeConvo = await ctx.prisma.conversation.findFirst({
//             where: {
//                 userId: ctx.session.user.id,
                
//             },
//             orderBy: { createdAt: 'desc'}
//         });

        

//         const newConversation = await ctx.prisma.conversation.create({
//             data: {
//                 user: { connect: { id: ctx.session.user.id } },
                
//                 createdAt: new Date(),
//                 },
//                 });
//         // console.log("The new active convo ID is: ", newConversation.id)

//     // Return the new conversation ID
//     return { conversationId: newConversation.id };
// }),})
