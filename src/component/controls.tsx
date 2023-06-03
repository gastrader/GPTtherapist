// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// // Components
// import { ReactMediaRecorder, useReactMediaRecorder } from 'react-media-recorder-2'

// export const Controls = () => {
    
//     const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true, stopStreamsOnStop: true });

//     const sendMediaToServer = async (blob: Blob) => {
//         const formData = new FormData();
//         formData.append('audio', blob)
//         try {
//             const response = await axios.post('/api/voice', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//         } catch (error) {
//             console.error('Ahhhh error occurred while sending the audio:', error);
//         }
//     };
    

//     return (
        
//             <ReactMediaRecorder
//                 audio
//                 render={({
//                     startRecording,
//                     stopRecording,
//                     status,
//                     mediaBlobUrl,
//                 }) => (
                    
//                     <div className="rounded-md shadow-sm flex justify-center outline outline-black" role="group">
//                         <button id="start" onClick={startRecording} type="button" className="justify-center w-1/2 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
//                             <svg aria-hidden="true" className="w-4 h-4 mr-2 fill-current" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>play-circle</title><path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
//                             Record
//                         </button>
//                         <button id="stop" onClick={stopRecording} type="button" className="w-1/2 justify-center inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
//                             <svg aria-hidden="true" className="w-4 h-4 mr-2 fill-current" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>stop-circle</title><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9,9H15V15H9" /></svg>
//                             Stop
//                         </button>
//                         <p className='w-full text-center p-4'>Currently: {status}</p>
//                         <div>
//                             <audio src={mediaBlobUrl} controls />
//                         </div>
                        
//                     </div>

//                 )}
//                 onStop={(blobUrl: string, blob: Blob) => {
//                     console.log('recording stopped.: ', blobUrl, blob)
//                     sendMediaToServer(blob).catch((error)=> {
//                         console.error("An error occured sending audio", error)
//                     })
//                 }}
//             />
        
//     )}
            