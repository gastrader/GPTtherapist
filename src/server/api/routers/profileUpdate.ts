
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    updateName: protectedProcedure.input(
        z.object({
            name: z.string(),
            age: z.string(),
            gender: z.string(),
            bio: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        console.log("USER INPUT:", input.name);

        
        await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                name: {
                    set: input.name
                },
                age:{
                    set: input.age
                },
                gender:{
                    set: input.gender
                },
                bio:{
                    set: input.bio
                }
            }
        });
        console.log("username should be set!")
        return {
            message: "success",
        }
    }),
});
