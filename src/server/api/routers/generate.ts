import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

export const generateRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    generateResponse: publicProcedure.input(
        z.object({
            prompt: z.string(),
        })
    ).mutation(({ctx, input})=> {
        console.log("we are here", input.prompt);
        return{
            message: "success"
        }
    })
});
