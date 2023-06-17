/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import { getChatResponse, s3PutBase64 } from "../../utils";
import { createAIVideoResponse } from "../../createAIVideoResponse";
import type Error from "next/error";
import fs from 'fs';

const CONVERSATION_CREATE_CREDITS = -1;
const CONVERSATION_REPLY_CREDITS = -1;
const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export const conversationRouter = createTRPCRouter({
  conversations: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id) return;

    const { session } = ctx;

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: session.user.id,
      }
    });

    if (!user) return;

    const conversations = await ctx.prisma.conversation.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return conversations;
  }),
  getConversation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.id) return;

      const { session } = ctx;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user) return;

      const conversation = await ctx.prisma.conversation.findUnique({
        where: {
          id: input.id,
        },
        include: {
          messages: true,
        },
      });

      return conversation;
    }),
  createConversation: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        conversationType: z.enum(["TEXT", "VIDEO"]).default("TEXT"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) return;

      const { session } = ctx;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user) return;

      if (user.credits < CONVERSATION_CREATE_CREDITS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You do not have enough credits. Needed: `,
        });
      }

      try {
        const conversation = await ctx.prisma.conversation.create({
          data: {
            mode: input.conversationType,
            subject: "THERAPIST CHAT",
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });

        if (input.conversationType === "VIDEO") {
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
                                .catch((error: Error) => {
                                    reject(error);
                                });
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            });
        }
        const transcription = await convertbase64tomp3(input.message);
        console.log("The transcript is: ", transcription);
          const { aiResponse, base64, clipId, resultUrl } =
            await createAIVideoResponse(transcription);

          const message = await ctx.prisma.message.create({
            data: {
              prompt: transcription,
              aiResponseText: aiResponse,
              aiResponseUrl: resultUrl, // this should be the bucket url ideally
              user: {
                connect: {
                  id: session.user.id,
                },
              },
              conversation: {
                connect: {
                  id: conversation.id,
                },
              },
            },
            include: {
              conversation: true,
            },
          });

          const bucketKey = `${session.user.id}-${conversation.id}-${message.id}`;

          s3PutBase64(Buffer.from(base64, "base64"), bucketKey);

          return message;
        }
        
        const bio = user.bio || ""
        const updatedMessage = `A quick background bio about myself is: '${bio}'. If you get information from my bio please be clear. My new message is: '${input.message}'.`
        const aiResponse = await getChatResponse(updatedMessage);
        const message = await ctx.prisma.message.create({
          data: {
            prompt: input.message,
            aiResponseText: aiResponse,
            user: {
              connect: {
                id: session.user.id,
              },
            },
            conversation: {
              connect: {
                id: conversation.id,
              },
            },
          },
          include: {
            conversation: true,
          },
        });
        return message;
      } catch (e) {
        console.log(e);
      }
    }),
  updateConversation: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        conversationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) return;

      const { session } = ctx;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user) return;

      if (user.credits < CONVERSATION_REPLY_CREDITS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You do not have enough credits. Needed: `,
        });
      }
      
      try {
        //FETCH USER DATA FOR BIO.
        // const user = await ctx.prisma.user.findUnique({
        // where: {
        //   id: session.user.id,
        // },
      // });
        
        const conversation = await ctx.prisma.conversation.findUnique({
          where: {
            id: input.conversationId,
          },
          include: {
            messages: true,
          },
        });

        if (!conversation) throw new TRPCError({ code: "BAD_REQUEST" });

        if (conversation.mode === "VIDEO") {
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
                    delay(500)
                        .then(() => {
                            openai.createTranscription(fs.createReadStream(filePath) as any, "whisper-1")
                                .then((response) => {
                                    const transcription = response.data.text;
                                    resolve(transcription);
                                })
                                .catch((error: Error) => {
                                    reject(error);
                                });
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            });
        }
        const transcription = await convertbase64tomp3(input.message);
        
        console.log("The transcript is: ", transcription);

          const { aiResponse, base64, clipId, resultUrl } =
            await createAIVideoResponse(transcription);

          const message = await ctx.prisma.message.create({
            data: {
              prompt: transcription,
              aiResponseText: aiResponse,
              aiResponseUrl: resultUrl, // this should be the bucket url ideally
              user: {
                connect: {
                  id: session.user.id,
                },
              },
              conversation: {
                connect: {
                  id: conversation.id,
                },
              },
            },
            include: {
              conversation: true,
            },
          });

          const bucketKey = `${session.user.id}-${conversation.id}-${message.id}`;

          s3PutBase64(Buffer.from(base64, "base64"), bucketKey);

          return message;
        }
        const simplifiedConvo = conversation.messages.map(obj => ({
          assistant: obj.aiResponseText,
          user: obj.prompt,
        }))
        // const bio2: string = user?.bio || ""
        const conversationString = simplifiedConvo.map(entry => `User: '${entry.user}', Assistant: '${entry.assistant}'`).join(' ')
        const fullMessage = `This is the context of our chat so far where you are the assistant and I am the user: '${conversationString}'. My new message is: '${input.message}'.`
        const aiResponse = await getChatResponse(fullMessage);
        const message = await ctx.prisma.message.create({
          data: {
            prompt: input.message,
            aiResponseText: aiResponse,
            user: {
              connect: {
                id: session.user.id,
              },
            },
            conversation: {
              connect: {
                id: conversation.id,
              },
            },
          },
          include: {
            conversation: true,
          },
        });
        return message;
      } catch (e) {
        console.log(e);
      }
    }),
});
