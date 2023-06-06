/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

//testing on mac


import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import fs from 'fs';
import axios from "axios";


const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const voiceRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    voiceResponse: protectedProcedure.input(
        z.object({
            audio: z.string() ,
        })
    ).mutation(async ({ ctx, input }) => {
        console.log("WE ARE IN DA BACKEND")

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
        
        // function convertbase64tomp3(base64: string) {
        //     const decodedData = Buffer.from(base64, 'base64');
        //     const filePath = `tmp/${ctx.session.user.id}_audio.mp3`
        //     const fileStream = fs.createWriteStream(filePath);
        //     fileStream.write(decodedData);
        //     fileStream.end();
        //     fileStream.on('finish', () => {
        //         console.log('MP3 file created successfully.');
                
        //     });
        // }
        // convertbase64tomp3(input.audio);




        const form = new FormData();
        form.append("file", "C:/Users/gavin/Javascript Projects/therapy_new2/tmp/cli2muaok0000599wgj698vy5_audio.mp3");
        form.append("model", "whisper-1");

        const options = {
            method: 'POST',
            url: 'https://api.openai.com/v1/audio/transcriptions',
            headers: {
                'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                Authorization: 'Bearer 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'
            },
            data: '[form]'
        };

        try{
            const responsey = await axios.request(options);
            if (responsey) {
                console.log(responsey)
            } else {
                console.log("Waiting 2 more seconds"); // Poll every 2 seconds (adjust as needed)
                await new Promise((resolve) => setTimeout(resolve, 2000));
        }}catch(error){
            console.error('Error was:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve transcripty poo!',
            });
        }

        // axios.request(options).then(function (response) {
        //     console.log(response);
        // }).catch(function (error) {
        //     console.error(error);
        // });

        // const chatresponse = await openai.createChatCompletion({
        //     model: "gpt-3.5-turbo",
        //     //TODO: fetch users chat history to input here.
        //     messages: [
        //         { "role": "system", "content": "a compassionate therapist, who is interested in learning more and giving actionable but helpful advice. please keep your responses to around 50 words." },
        //         { "role": "user", "content": input.audio }],
        // });
        
        // const message = chatresponse.data.choices[0]?.message?.content


        const resultUrl = "https://d-id-clips-prod.s3.us-west-2.amazonaws.com/google-oauth2%7C102007001941522101997/clp_vWmcYyrNSUZaFxBNJ2Zxv/amy-jcwCkr1grs.mp4?AWSAccessKeyId=AKIA5CUMPJBIJ7CPKJNP&Expires=1685653651&Signature=sgflUYsL7xavswHmGLmbPKPILMM%3D&X-Amzn-Trace-Id=Root%3D1-6477b713-7de7a8f039537d66031eb286%3BParent%3D0852d48371ffdb93%3BSampled%3D0%3BLineage%3D84e41ec0%3A0"

        return {
            aiMessage: resultUrl
        }
    })
});
