/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {createTRPCRouter,protectedProcedure} from "~/server/api/trpc";
import  { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
import axios from "axios";
import AWS from "aws-sdk";


const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: env.ACCESS_KEY_ID,
        secretAccessKey: env.SECRET_ACCESS_KEY,
    },
    
})

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
                    decrement:10,
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
                video_prompt: input.prompt,
                video_ai_response: message,
                userId: ctx.session.user.id,
            },
        });
        console.log("the convo and convo ID are: ", convo, convo.id)

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
        // const clipId = "clp_vWmcYyrNSUZaFxBNJ2Zxv"
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



        // const resultUrl = "https://d-id-clips-prod.s3.us-west-2.amazonaws.com/google-oauth2%7C102007001941522101997/clp_vWmcYyrNSUZaFxBNJ2Zxv/amy-jcwCkr1grs.mp4?AWSAccessKeyId=AKIA5CUMPJBIJ7CPKJNP&Expires=1685653651&Signature=sgflUYsL7xavswHmGLmbPKPILMM%3D&X-Amzn-Trace-Id=Root%3D1-6477b713-7de7a8f039537d66031eb286%3BParent%3D0852d48371ffdb93%3BSampled%3D0%3BLineage%3D84e41ec0%3A0"
        
        async function convertmp4tobase64(url: string) {
            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                });
                const base64 = Buffer.from(response.data, 'binary').toString('base64');
                return base64
            } catch (error) {
                throw error;
            }
        }

        convertmp4tobase64(resultUrl)
            .then(base64Data => {
            const params = {
                Bucket: "gpttherapy",
                Body: Buffer.from(base64Data, "base64"),
                Key: convo.id,
                ContentEncoding: "base64",
                ContentType: "video/mp4",
            };
            s3.putObject(params, (err, data) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("base64 logged here... should be added to bucket as well: ", data);

                }
            })
            
        }).catch(error => {
            console.error(error);
        })
        

        return{
            aiMessage: resultUrl
        }
    })
});
