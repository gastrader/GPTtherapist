/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import fs from 'fs';
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
                    decrement: 10,
                }
            }
        });

        if (count <= 0) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You do not have enough credits..',
            })
        }

        function delay(ms: number) {
            return new Promise((resolve) => setTimeout (resolve, ms))
        }
        
        function convertbase64tomp3(base64: string): Promise<string> {
            return new Promise((resolve, reject) => {
                const decodedData = Buffer.from(base64, 'base64');
                const filePath = `tmp/${ctx.session.user.id}_audio.mp3`;
                const fileStream = fs.createWriteStream(filePath);
                fileStream.write(decodedData);
                fileStream.end();
                fileStream.on('finish', () => {
                    console.log('MP3 file created successfully.');
                    // After the file is created, wait for 2 seconds and then make the API call
                    delay(2000)
                        .then(() => {
                            openai.createTranscription(fs.createReadStream(filePath) as any, "whisper-1")
                                .then((response) => {
                                    const transcription = response.data.text;
                                    resolve(transcription);
                                })
                                .catch((error) => {
                                    reject(error);
                                });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
            });
        }

        const transcription = await convertbase64tomp3(input.audio);
        console.log("The transcript is: ", transcription);
        


        const chatresponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            //TODO: fetch users chat history to input here.
            messages: [
                { "role": "system", "content": env.OPENAI_PROMPT },
                { "role": "user", "content": transcription }],
        });

        const message = chatresponse.data.choices[0]?.message?.content
        console.log("The therapist response is:", message)

        //ADD TO DB
        const convo = await ctx.prisma.message.create({
            data: {
                video_prompt: transcription,
                video_ai_response: message,
                userId: ctx.session.user.id,
                createdAt: new Date()
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
        console.log("This clip id is: ", clipId)

        const get_options = {
            method: 'GET',
            url: 'https://api.d-id.com/clips/' + clipId,
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
        
        //TO TEST WITH:
        // const resultUrl = "https://d-id-clips-prod.s3.us-west-2.amazonaws.com/google-oauth2%7C102007001941522101997/clp_vWmcYyrNSUZaFxBNJ2Zxv/amy-jcwCkr1grs.mp4?AWSAccessKeyId=AKIA5CUMPJBIJ7CPKJNP&Expires=1685653651&Signature=sgflUYsL7xavswHmGLmbPKPILMM%3D&X-Amzn-Trace-Id=Root%3D1-6477b713-7de7a8f039537d66031eb286%3BParent%3D0852d48371ffdb93%3BSampled%3D0%3BLineage%3D84e41ec0%3A0"

        return {
            aiMessage: resultUrl
        }
    })
});
