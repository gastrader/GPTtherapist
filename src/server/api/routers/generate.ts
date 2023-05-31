/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {createTRPCRouter,protectedProcedure} from "~/server/api/trpc";
import  { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
import axios from "axios";
// import AWS from "aws-sdk";


const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const s3 = new AWS.S3({
//     credentials: {
//         accessKeyId: env.ACCESS_KEY_ID,
//         secretAccessKey: env.SECRET_ACCESS_KEY,
//     },
//     region: "us-east-1",
// })

export const generateRouter = createTRPCRouter({
    //mutation = insert/delete or modify state of server
    //query = get data back
    generateResponse: protectedProcedure.input(
        z.object({
            prompt: z.string(),
        })
    ).mutation(async ({ctx, input})=> {
        console.log("USER INPUT:", input.prompt);

        //verify user has enough credits.
        const {count} = await ctx.prisma.user.updateMany({
            where: {
                id: ctx.session.user.id,
                credits: {
                    gte: 1,
                },
            },
            data: {
                credits: {
                    decrement:1,
                }
            }
        });

        if (count <= 0) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You do not have enough credits..',
            })
        }
        //TO DO: make fetch request to OPENAI api
        const chatresponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            //TODO: fetch users chat history to input here.
            messages: [
                { "role": "system", "content": "a compassionate therapist, who is interested in learning more and giving actionable but helpful advice. please keep your responses to around 50 words." },
                { "role": "user", "content": input.prompt }],
        });
        
        const message = chatresponse.data.choices[0]?.message?.content

        //TODO FIX LIOL 
        const convo = await ctx.prisma.message.create({
            data: {
                prompt: input.prompt,
                ai_response: message,
                userId: ctx.session.user.id,
            },
        });

        const post_options = {
            method: 'POST',
            url: 'https://api.d-id.com/clips',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic Z2F2aW5wOTZAZ21haWwuY29t:QtjGa2adqzii57Tk5HOzR'
            },
            data: {
                script: { type: 'text', input: message },
                presenter_id: 'amy-jcwCkr1grs',
                driver_id: 'uM00QMwJ9x'
            }
        };

        const res = await axios.request(post_options)

        const clipId: string = res.data.id
        // const clipId = "clp_yhWAiteFPzdYrLwCc58Zi"
        console.log("This clip id is: ", clipId)

        const get_options = {
            method: 'GET',
            url: 'https://api.d-id.com/clips/'+ clipId,
            headers: { Authorization: 'Basic Z2F2aW5wOTZAZ21haWwuY29t:QtjGa2adqzii57Tk5HOzR' }
        };

        const pollForResultUrl = async () => {
            while (true) {
                try {
                    const response = await axios.request(get_options);
                    if (response.data.result_url) {
                        console.log('Result URL:', response.data.result_url);
                        return response.data.result_url;
                    } else {
                        console.log("Waiting 2 more seconds"); // Poll every 2 seconds (adjust as needed)
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                    }
                } catch (error) {
                    console.error('Error:', error);
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Failed to retrieve result URL',
                    });
                }
            }
        };

        const resultUrl = await pollForResultUrl();
        

        //TO DO: convert mp4 to BLOB and store in bucket.

        
        
        // const resulturl = "https://d-id-clips-prod.s3.us-west-2.amazonaws.com/google-oauth2%7C102007001941522101997/clp_yhWAiteFPzdYrLwCc58Zi/amy-jcwCkr1grs.mp4?AWSAccessKeyId=AKIA5CUMPJBIJ7CPKJNP&Expires=1685562716&Signature=Xsm77wcU21Tu2xWxRAyK200TGeo%3D&X-Amzn-Trace-Id=Root%3D1-647653dc-2189d0777cbaa9e13505033c%3BParent%3D419cc07554a6cb83%3BSampled%3D0%3BLineage%3D84e41ec0%3A0"
        
        // axios.get(resulturl, {responseType: "blob"}).then(function(response) {
        //     const blob = response.data;
        //     s3.putObject({
        //         Bucket: "gpttherapy",
        //         Key: convo.id,
        //         Body: blob,
        //     })
        //     console.log("Blob object has been created");
        // }).catch(function(error) {
        //     console.log('Error:', error);
        // })

        return{
            aiMessage: resultUrl
        }
    })
});
