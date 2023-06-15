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

export default function Chatbox() {
  const { buyCredits } = useBuyCredits();
  const session = useSession();
  const isLoggedIn = !!session.data;
  const utils = api.useContext();
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<{ type: string; message: string }[]>([
    {
      type: "bot",
      message:
        "Hi! My name is Thera, a compassionate AI therapist ready to lend an empathetic ear and guide you towards self-discovery and personal growth. Step into a realm of profound conversation where you can explore your innermost thoughts, find solace, and unlock the transformative power of therapeutic support. Send me a message to get started!",
    },
  ]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const conversationId = router.query.id;
  const { mutateAsync } = api.conversation.createConversation.useMutation();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const res = await mutateAsync({ message: inputValue });

    if (res) {
      await router.replace(`/conversations/${res.conversation.id}`);
    }
  };

  if (conversationId === "new") {
    return (
      <div className="container mx-auto mt-20 max-w-[700px] items-center justify-center rounded">
        <div className="flex h-[600px] flex-col rounded-xl border border-gray-600 bg-gray-100">
          <h1 className="blue_gradient py-3 text-center text-4xl font-bold text-white">
            THERA CHAT 🤖{" "}
          </h1>
          <div className="flex-grow overflow-y-auto p-6">
            <div className="flex flex-col space-y-4 "></div>
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
              <button
                className="mx-2 my-2 rounded-lg bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
                type="submit"
              >
                Send
              </button>
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
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = api.conversation.getConversation.useQuery({ id });

  const { mutateAsync } = api.conversation.updateConversation.useMutation();

  const [message, setMessage] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    const res = await mutateAsync(
      { message, conversationId: id },
      {
        onSuccess: () => {
          void queryContext.conversation.getConversation.invalidate();
          setMessage("");
          setLoading(false);
        },
      }
    );
  };
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <div className="container mx-auto mt-20 max-w-[700px] items-center justify-center rounded">
      <div className="flex h-[600px] flex-col rounded-xl border border-gray-600 bg-gray-100">
        <h1 className="blue_gradient py-3 text-center text-4xl font-bold text-white">
          THERA CHAT{" "}
        </h1>
        <div className="flex-grow overflow-y-auto p-6" ref={chatMessagesRef}>
          <div className="flex flex-col space-y-4 ">
            {data?.messages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-4">
                <div className="flex justify-end ">
                  <div className="max-w-sm items-end rounded-xl bg-blue-500 p-4 text-sm text-white">
                    {msg.prompt}
                  </div>
                </div>
                <div className="flex justify-start ">
                  <div className="max-w-sm items-end rounded-xl bg-gray-200 p-4 text-sm text-black">
                    {msg.aiResponseText}
                  </div>
                </div>
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
