
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";


const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const videoRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    generateResponse: protectedProcedure.input(
        z.object({
            prompt: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        console.log("USER INPUT:", input.prompt);

        //verify user has enough credits.
        const { count } = await ctx.prisma.user.updateMany({
            where: {
                id: ctx.session.user.id,
                credits: {
                    gte: 1,
                },
            },
            data: {
                credits: {
                    decrement: 1,
                }
            }
        });

        if (count <= 0) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You do not have enough credits..',
            })
        }
        //make fetch request to OPENAI api
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            //TODO: fetch users chat history to input here.
            messages: [
                { "role": "system", "content": "a compassionate therapist, who is interested in learning more and giving actionable but helpful advice." },
                { "role": "user", "content": input.prompt }],
        });


        const message = response.data.choices[0]?.message?.content
        //TODO FIX THIS TYPE ERROR
        await ctx.prisma.message.create({
            data: {
                prompt: input.prompt,
                ai_response: message,
                userId: ctx.session.user.id,
            },
        });

        //make fetch to eleven labs

        //store file in s3 bucket

        //make fetch to DID

        //display video

        return {
            aiMessage: message
        }
    })
});
