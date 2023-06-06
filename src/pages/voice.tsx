import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { ReactMediaRecorder, useReactMediaRecorder } from "react-media-recorder-2";
import { useBuyCredits } from "~/hooks/useBuyCredits";
import { api } from "~/utils/api";


const GeneratePage: NextPage = () => {

    useReactMediaRecorder({ audio: true, stopStreamsOnStop: true });

    const utils = api.useContext()
    const { buyCredits } = useBuyCredits();

    const session = useSession();
    const isLoggedIn = !!session.data;

    const [aiMessage, setAiMessage] = useState('')
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const voiceResponse = api.voice.voiceResponse.useMutation({
        onSuccess(data) {
            console.log("mutation finished:", data.aiMessage)
            if (!data.aiMessage) return;
            setIsVideoPlaying(true)
            setAiMessage(data.aiMessage)
            setIsLoading(false)
            void utils.user.getCredits.invalidate()
        }
    });

    function blobToBase64(blob: Blob): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                console.log("Base 64 string is: ", base64String)
                const splitIndex = base64String.indexOf(',') + 1;
                if (splitIndex > 0) {
                    const base64 = base64String.substr(splitIndex);
                    resolve(base64);
                } else {
                    reject(new Error('Unable to convert Blob to base64.'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    function transcribeBlob(blob: Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const transcribedText = reader.result;
                resolve(transcribedText);
            };
            reader.onerror = reject;
            reader.readAsText(blob);
        });
    }


    return (
        <>
            <Head>
                <title>GPTtherapy</title>
                <meta name="description" content="Therapy on the go" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center gap-4">
                {isLoggedIn && (
                    <>
                        {/* HOOK ON FRONT END HITS BACKEND TRPC MUTATION, RETURNS CHECKOUT SESSION ID TO REDIRECT TO STRIPE WHEN USER CLICKS ON THIS BUTTON */}
                        <button className="outline_btn items-center justify-center"
                            onClick={() => {
                                buyCredits().catch(console.error)
                            }}>Buy Credits
                        </button>
                    </>
                )}
                <ReactMediaRecorder
                    audio
                    render={({
                        startRecording,
                        stopRecording,
                        status,
                        mediaBlobUrl,
                    }) => (

                        <div className="rounded-md shadow-sm flex justify-center outline outline-black" role="group">
                            <button id="start" onClick={startRecording} type="button" className="justify-center w-1/2 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                <svg aria-hidden="true" className="w-4 h-4 mr-2 fill-current" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>play-circle</title><path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
                                Record
                            </button>
                            <button id="stop" onClick={stopRecording} type="button" className="w-1/2 justify-center inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                <svg aria-hidden="true" className="w-4 h-4 mr-2 fill-current" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>stop-circle</title><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9,9H15V15H9" /></svg>
                                Stop
                            </button>
                            <p className='w-full text-center p-4'>Currently: {status}</p>
                            <div>
                                <audio src={mediaBlobUrl} controls />
                            </div>

                        </div>
                    )}
                    onStop={(blobUrl: string, blob: Blob) => {
                        console.log('recording stopped: ', blobUrl, blob);
                        blobToBase64(blob)
                            .then((base64String) => {
                                // console.log(base64String);
                                voiceResponse.mutate({audio: base64String})

                            })
                            .catch((error) => {
                                console.error('Error converting blob to base64:', error);
                            });
                        
                    }}
                />
                {/* <div className="my-10 mx-5 w-[200px]" style={{ borderRadius: '70%', overflow: 'hidden', }}> */}
                <div className="my-10 mx-5 w-[500px]" >

                    {isLoading ? (
                        <div className="flex justify-center align-middle"> Loading... </div>
                    ) :
                        isVideoPlaying ? (
                            <video controls autoPlay>
                                <source src={aiMessage} type="video/mp4" />
                            </video>
                        ) : null}

                </div>
            </main>
        </>
    );
};

export default GeneratePage;
