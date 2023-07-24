/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useBuyCredits } from "~/hooks/useBuyCredits";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import newChat from "../../public/assets/images/newChat.svg";
import { Loader2, Send } from "lucide-react";
import { Button } from "../ui/button";
import { format, setDate } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ReactMediaRecorder } from "react-media-recorder-2";

export default function Videobox() {
  const { buyCredits } = useBuyCredits();
  const session = useSession();
  const isLoggedIn = !!session.data;
  const utils = api.useContext();
  const [aiMessage, setAiMessage] = useState("");

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const conversationId = router.query.id;
  const { mutateAsync } = api.conversation.createConversation.useMutation({
    onSuccess(data) {
      console.log("mutation finished the response is: ", data?.aiResponseText);
      if (!data?.aiResponseUrl) return;
      setAiMessage(data?.aiResponseUrl);
    },
  });

  //   const handleSubmit = async (event: { preventDefault: () => void }) => {
  //     event.preventDefault();

  //     const res = await mutateAsync({ message: inputValue, conversationType: "VIDEO" });

  //     if (res) {
  //       await router.replace(`/conversations/${res.conversation.id}?type=video`);
  //     }
  //   };

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log("Base 64 string is: ", base64String);
        const splitIndex = base64String.indexOf(",") + 1;
        if (splitIndex > 0) {
          const base64 = base64String.substr(splitIndex);
          resolve(base64);
        } else {
          reject(new Error("Unable to convert Blob to base64."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  if (conversationId === "new") {
    return (
      <div className="w-3/4 items-start justify-start rounded">
        <div className="flex h-full flex-col border border-gray-100 bg-white">
          <div className="flex items-center justify-between space-x-4 border-b-2 pl-2 pt-2">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/assets/images/thera.png" />
                <AvatarFallback>Th</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">Vidya</p>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-6" ref={chatMessagesRef}>
            <div className="flex flex-col space-y-4 ">
              <div className="flex max-w-lg justify-start rounded-xl bg-gray-200 px-4 text-sm">
                <video autoPlay src="/assets/videos/introvid.mp4">
                  Your Browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          <ReactMediaRecorder
            audio
            render={({
              startRecording,
              stopRecording,
              status,
              mediaBlobUrl,
            }) => (
              <div className="mx-4 my-2 flex w-auto items-center justify-center rounded-xl border border-gray-300 pt-2">
                <div className="w-1/3 rounded-xl bg-white" role="group">
                  <div>
                    <button
                      id="start"
                      onClick={startRecording}
                      type="button"
                      className="inline-flex w-1/2 items-center justify-center rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    >
                      <svg
                        aria-hidden="true"
                        className="mr-2 h-4 w-4 fill-current"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <title>play-circle</title>
                        <path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                      </svg>
                      Record
                    </button>
                    <button
                      id="stop"
                      onClick={stopRecording}
                      type="button"
                      className="inline-flex w-1/2 items-center justify-center rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    >
                      <svg
                        aria-hidden="true"
                        className="mr-2 h-4 w-4 fill-current"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <title>stop-circle</title>
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9,9H15V15H9" />
                      </svg>
                      Send
                    </button>
                  </div>
                  <p className="w-full p-2 text-center text-sm">
                    Currently: {status}
                  </p>
                </div>
              </div>
            )}
            onStop={async (blobUrl: string, blob: Blob) => {
              console.log("recording stopped: ", blobUrl, blob);
              try {
                const base64String = await blobToBase64(blob);
                console.log("DA BASE 64 STIRNG IS: ", base64String);
                const res = await mutateAsync({
                  message: base64String,
                  conversationType: "VIDEO",
                });
                if (res) {
                  await router.replace(
                    `/conversations/${res.conversation.id}?type=video`
                  );
                }
              } catch (error) {
                console.error(
                  "Error converting blob to base64 and sending mutation:",
                  error
                );
              }
            }}
          />
        </div>
      </div>
    );
  }
  return <ExistingVideobox id={conversationId as string} />;
}

function ExistingVideobox({ id }: { id: string }) {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const queryContext = api.useContext();

  const { data, isLoading } = api.conversation.getConversation.useQuery({ id });

  const { mutateAsync } = api.conversation.updateConversation.useMutation();

  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState(0);

  //   const handleSubmit = async (event: { preventDefault: () => void }) => {
  //     event.preventDefault();
  //       // Optimistically update the chat log with the new message

  //     const res = await mutateAsync(
  //       { message, conversationId: id },
  //       {
  //         onSuccess: () => {
  //           void queryContext.conversation.getConversation.invalidate();
  //         },});};

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messageCount, data]);

  //TIME IN CHAT BAR
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    if (data) {
      setTime(new Date(data.updatedAt));
    }
  }, [data]);
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log("Base 64 string is: ", base64String);
        const splitIndex = base64String.indexOf(",") + 1;
        if (splitIndex > 0) {
          const base64 = base64String.substr(splitIndex);
          resolve(base64);
        } else {
          reject(new Error("Unable to convert Blob to base64."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return (
    <div className="h-min w-3/4 items-start justify-start rounded">
      <div className="flex h-[800px] flex-col border border-gray-100 bg-white">
        <div className="flex items-center justify-between space-x-4 border-b-2 pl-2 pt-2">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/assets/images/thera.png" />
              <AvatarFallback>Th</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Vidya</p>
              <p className="text-sm text-muted-foreground">
                {time && time.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div
          className="max-h-full flex-grow overflow-y-auto p-6"
          ref={chatMessagesRef}
        >
          <div className="flex flex-col space-y-4 ">
            <div className="flex max-w-lg justify-start rounded-xl bg-gray-200 px-4 text-sm">
              <video src="/assets/videos/introvid.mp4">
                Your Browser does not support the video tag.
              </video>
            </div>
            {data?.messages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-4">
                <div className="flex justify-end ">
                  <div className="max-w-lg items-end rounded-xl bg-blue-500 p-4 text-sm text-white">
                    {msg.prompt}
                  </div>
                </div>
                  <div className="flex justify-start  ">
                    <video
                      autoPlay
                      src={msg.aiResponseUrl || undefined}
                      className="max-w-lg h-[300px] items-end rounded-xl bg-gray-200 p-4 text-sm text-black"
                    ></video>
                  </div>
              </div>
            ))}
          </div>
        </div>
        <ReactMediaRecorder
        
          audio
          render={({ startRecording, stopRecording, status, mediaBlobUrl }) => (
            <div className="mx-4 my-2 flex w-auto items-center justify-center rounded-xl border border-gray-300 pt-2">
              <div className="w-1/3 rounded-xl bg-white" role="group">
                <div>
                  <button
                    id="start"
                    onClick={startRecording}
                    type="button"
                    className="inline-flex w-1/2 items-center justify-center rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                  >
                    <svg
                      aria-hidden="true"
                      className="mr-2 h-4 w-4 fill-current"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>play-circle</title>
                      <path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                    Record
                  </button>
                  <button
                    id="stop"
                    onClick={stopRecording}
                    type="button"
                    className="inline-flex w-1/2 items-center justify-center rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                  >
                    <svg
                      aria-hidden="true"
                      className="mr-2 h-4 w-4 fill-current"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>stop-circle</title>
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9,9H15V15H9" />
                    </svg>
                    Send
                  </button>
                </div>
                <p className="w-full p-2 text-center text-sm">
                  Currently: {status}
                </p>
              </div>
            </div>
          )}
          onStop={async (blobUrl: string, blob: Blob) => {
            console.log("recording stopped: ", blobUrl, blob);
            const base64String = await blobToBase64(blob);
            console.log("DA BASE 64 STIRNG IS: ", base64String);
            const res = await mutateAsync(
              { message: base64String, conversationId: id },
              {
                onSuccess: async () => {
                  await queryContext.conversation.getConversation.invalidate();
                  setMessageCount((prevCount) => prevCount + 1);
                },
              }
            );
          }}
        />
      </div>
    </div>
  );
}
