import axios from "axios";
import { getChatResponse, getdIDClipId, mp4Urltobase64 } from "./utils";
import { TRPCError } from "@trpc/server";

export async function createAIVideoResponse(message: string) {
  const aiResponse = await getChatResponse(message);

  const clipId = await getdIDClipId(aiResponse);

  const get_options = {
    method: "GET",
    url: "https://api.d-id.com/clips/" + clipId,
    headers: {
      Authorization: "Basic Z2F2aW5wOTZAZ21haWwuY29t:QtjGa2adqzii57Tk5HOzR",
    },
  };

  const pollForResultUrl = async () => {
    while (true) {
      try {
        const response = await axios.request<{ result_url: string }>(
          get_options
        );
        if (response.data.result_url) {
          console.log("Result URL:", response.data.result_url);
          return response.data.result_url;
        } else {
          console.log("Waiting 2 more seconds"); // Poll every 2 seconds (adjust as needed)
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error("Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve result URL",
        });
      }
    }
  };

  const resultUrl = await pollForResultUrl();

  //TO DO: convert mp4 to BLOB and store in bucket.

  // const resultUrl = "https://d-id-clips-prod.s3.us-west-2.amazonaws.com/google-oauth2%7C102007001941522101997/clp_vWmcYyrNSUZaFxBNJ2Zxv/amy-jcwCkr1grs.mp4?AWSAccessKeyId=AKIA5CUMPJBIJ7CPKJNP&Expires=1685653651&Signature=sgflUYsL7xavswHmGLmbPKPILMM%3D&X-Amzn-Trace-Id=Root%3D1-6477b713-7de7a8f039537d66031eb286%3BParent%3D0852d48371ffdb93%3BSampled%3D0%3BLineage%3D84e41ec0%3A0"

  const base64 = await mp4Urltobase64(resultUrl).catch(() =>
    console.log("wtf")
  );

  if (!base64) throw new Error(`Got no base64 conversation data`);

  return { aiResponse, base64, clipId, resultUrl };
}
