/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useBuyCredits } from "~/hooks/useBuyCredits";
import { api } from "~/utils/api";
import TypingAnimation from "~/component/typingAnimation";

const ChatPage: NextPage = () => {

    const { buyCredits } = useBuyCredits();
    const session = useSession();
    const isLoggedIn = !!session.data;
    const utils = api.useContext()
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [chatLog, setChatLog] = useState<{ type: string, message: string }[]>([{ type: "bot", message: "Hi! My name is Thera, a compassionate AI therapist ready to lend an empathetic ear and guide you towards self-discovery and personal growth. Step into a realm of profound conversation where you can explore your innermost thoughts, find solace, and unlock the transformative power of therapeutic support. Send me a message to get started!"}]);
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    
    const chatResponse = api.chat.chatResponse.useMutation({
        onSuccess(data) {
            console.log("The response is: ", data.chatMessage);
            setChatLog((prevChatLog: { type: string; message: string }[]) => [
                ...prevChatLog,
                { type: "bot", message: data.chatMessage || "" }
            ]);
            setIsLoading(false);
            void utils.user.getCredits.invalidate()
        }
    });


const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsLoading(true)
    setChatLog((prevChatLog) => [
        ...prevChatLog,
        { type: "user", message: inputValue },
    ]);
    chatResponse.mutate(inputValue);
    setInputValue("");
}
useEffect(() => {
    if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop =
            chatMessagesRef.current.scrollHeight;
    }
}, [chatLog]);


    
    return (
        <>
            <Head>
                <title>GPTtherapy</title>
                <meta name="description" content="Therapy on the go" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className="container rounded mx-auto max-w-[700px] mt-10 ">
                <div className="flex flex-col h-[600px] bg-gray-100 rounded-xl border border-gray-600">
                    <h1 className="text-center py-3 text-white font-bold text-4xl blue_gradient">THERA CHAT 🤖 </h1>
                    <div className="overflow-y-auto flex-grow p-6" ref={chatMessagesRef}>
                        <div className="flex flex-col space-y-4 ">
                            {chatLog.map((message, index) => (
                                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded-xl  p-4 max-w-sm text-sm`}> 
                                    {message.message}
                                    </div>
                                </div>
                            ))}
                            {
                                isLoading && 
                                <div key={chatLog.length} className="flex-row justify-start">
                                    <div className="bg-gray-300 rounded-lg p-4 text-black max-w-sm">
                                        <TypingAnimation/>
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                    
                    <form className="flex-non p-6 items-end" onSubmit={handleSubmit}>
                        <div className="flex rounded-xl border border-gray-700 bg-gray-200">

                        
                        <input
                            className="flex-grow px-4 py-2 bg-gray-200 text-black focus:outline-none rounded-xl"
                            type="text"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button className="rounded-lg bg-gray-400 my-2 mx-2 px-4 py-2 text-white font-semibold hover:bg-gray-500" type="submit">Send</button>
                        </div>
                    </form>
                        {isLoggedIn && (
                        <button className="outline_btn mb-4 max-w-xs mx-auto"
                            onClick={() => {
                                buyCredits().catch(console.error)
                            }}>Buy Credits
                        </button>
                        )}

                        
                    
                </div>
            </div>
        </>
    );
};

export default ChatPage;
