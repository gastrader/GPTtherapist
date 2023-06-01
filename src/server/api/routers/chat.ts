/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const chatRouter = createTRPCRouter({

    chatResponse: protectedProcedure.input(
        z.string()).mutation(async ({ ctx, input }) => {
        console.log("USER INPUT:", input);

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
        
        const chatresponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            
            messages: [
                { "role": "system", "content": "a compassionate therapist, who is interested in learning more and giving actionable but helpful advice. Please feel free to ask for more detail if required to make a decision. Please keep your answers to around 50 words maximum." },
                { "role": "user", "content": input }],
        });

        const message = chatresponse.data.choices[0]?.message?.content
        console.log("response is: ", message)

        
        // const convo = await ctx.prisma.message.create({
        //     data: {
        //         prompt: input.prompt,
        //         ai_response: message,
        //         userId: ctx.session.user.id,
        //     },
        // });
        // console.log("the convo and convo ID are: ", convo, convo.id)

        return {
            chatMessage: message
        }



})})
