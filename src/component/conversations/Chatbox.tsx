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
import { setDate } from "date-fns";

export default function Chatbox() {
  const { buyCredits } = useBuyCredits();
  const session = useSession();
  const isLoggedIn = !!session.data;
  const utils = api.useContext();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const botMessage = [
    {
      type: "bot",
      message:
        "Hi! My name is Thera, a compassionate AI therapist ready to lend an empathetic ear and guide you towards self-discovery and personal growth. Step into a realm of profound conversation where you can explore your innermost thoughts, find solace, and unlock the transformative power of therapeutic support. Send me a message to get started!",
    },
  ]
  const [chatLog, setChatLog] = useState<{ type: string; message: string }[]>(botMessage);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const conversationId = router.query.id;
  const { mutateAsync } = api.conversation.createConversation.useMutation();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true)
    setChatLog(prevChatLog => [...prevChatLog, { type: 'user', message: inputValue }]);
    setInputValue("")
    const res = await mutateAsync({ message: inputValue });

    if (res) {
      await router.replace(`/conversations/${res.conversation.id}`);
    }
    setLoading(false)
    
  };
  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      setChatLog(botMessage); // Clear chat log on route change
    };

    router.events.on('routeChangeStart', handleRouteChange)
    setLoading(false)
    // Clean up the subscription on unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      setLoading(false)
    }
  }, []);

  if (conversationId === "new") {
    return (
      <div className="container mx-auto mt-20 max-w-[700px] items-center justify-center rounded">
        <div className="flex h-[600px] flex-col rounded-xl border border-gray-600 bg-gray-100">
          <h1 className="blue_gradient py-3 text-center text-4xl font-bold text-white">
            THERA CHAT 🤖{" "}
          </h1>
          <div className="flex-grow overflow-y-auto p-6" ref={chatMessagesRef}>
            <div className="flex flex-col space-y-4 ">
              
              {chatLog.map((message, index) => (
                                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded-xl  p-4 max-w-sm text-sm`}> 
                                    {message.message}
                                    </div>
                                </div>
                            ))}
          </div>
        </div>

          <form className="flex-non items-end p-6" onSubmit={handleSubmit}>
            <div className="flex rounded-xl border border-gray-700 bg-gray-200">
              <input
                className="flex-grow rounded-xl bg-gray-200 px-4 py-2 text-sm text-black focus:outline-none"
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            {loading ? (
              <Button disabled className="m-1 w-[100px]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sent
              </Button>
            ) : (
              <Button variant="default" className="m-1 w-[100px]">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            )}
            </div>
          </form>
        </div>
      </div>
    );
  }
  return <ExistingChatbox id={conversationId as string} />;
}

function ExistingChatbox({ id }: { id: string }) {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const queryContext = api.useContext();
  const botMessage = "Hi! My name is Thera, a compassionate AI therapist ready to lend an empathetic ear and guide you towards self-discovery and personal growth. Step into a realm of profound conversation where you can explore your innermost thoughts, find solace, and unlock the transformative power of therapeutic support. Send me a message to get started!"

  const [loading, setLoading] = useState(false);

  const { data, isLoading } = api.conversation.getConversation.useQuery({ id });

  const { mutateAsync } = api.conversation.updateConversation.useMutation();

  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState(0);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    setMessage("")
    
      // Optimistically update the chat log with the new message
    data?.messages.push({
      id: Math.random().toString(), // Temporary id for key prop
      prompt: message,
      aiResponseText: '', // AI response is empty initially
      createdAt: setDate(1,1),
      aiResponseUrl: '',
      userId:'' ,
      conversationId: '',
    });
    setMessageCount(prevCount => prevCount + 1);
    
    const res = await mutateAsync(
      { message, conversationId: id },
      {
        onSuccess: () => {
          void queryContext.conversation.getConversation.invalidate();
          setLoading(false);
        },
      }
    );
  };
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messageCount, data]);

  return (
    <div className="container mx-auto mt-20 max-w-[700px] items-center justify-center rounded">
      <div className="flex h-[600px] flex-col rounded-xl border border-gray-600 bg-gray-100">
        <h1 className="blue_gradient py-3 text-center text-4xl font-bold text-white">
          THERA CHAT{" "}
        </h1>
        <div className="flex-grow overflow-y-auto p-6" ref={chatMessagesRef}>
          <div className="flex flex-col space-y-4 ">
            <div className="max-w-sm items-end rounded-xl bg-gray-200 p-4 text-sm text-black">
              {botMessage}
            </div>
            {data?.messages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-4">
                <div className="flex justify-end ">
                  <div className="max-w-sm items-end rounded-xl bg-blue-500 p-4 text-sm text-white">
                    {msg.prompt}
                  </div>
                </div>
                {msg.aiResponseText.length > 0 && (
                  <div className="flex justify-start ">
                    <div className="max-w-sm items-end rounded-xl bg-gray-200 p-4 text-sm text-black">
                      {msg.aiResponseText}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="flex rounded-xl border border-gray-700 bg-gray-200">
            <input
              className="flex-grow rounded-xl bg-gray-200 px-4 py-2 text-sm text-black focus:outline-none"
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {loading ? (
              <Button disabled className="m-1 w-[100px]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sent
              </Button>
            ) : (
              <Button variant="default" className="m-1 w-[100px]">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
