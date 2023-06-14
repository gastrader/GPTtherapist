import { Configuration, OpenAIApi } from "openai";
import { env } from "../env.mjs";
import axios from "axios";
import AWS from "aws-sdk";
import { api } from "~/utils/api";
const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

export async function getChatResponse(message: string): Promise<string> {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    //TODO: param for users chat history to add here.
    messages: [
      { role: "system", content: env.OPENAI_PROMPT },
      { role: "user", content: message },
    ],
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return res.data.choices[0]?.message?.content as string;
}

export async function getdIDClipId(text: string): Promise<string> {
  const post_options = {
    method: "POST",
    url: "https://api.d-id.com/clips",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic Z2F2aW5wOTZAZ21haWwuY29t:QtjGa2adqzii57Tk5HOzR",
    },
    data: {
      script: { type: "text", input: text },
      presenter_id: "amy-jcwCkr1grs",
      driver_id: "uM00QMwJ9x",
    },
  };

  const res = await axios.request<{ id: string }>(post_options);

  const clipId = res.data.id;
  // const clipId = "clp_vWmcYyrNSUZaFxBNJ2Zxv"
  console.log("This clip id is: ", clipId);

  return clipId;
}

export async function mp4Urltobase64(url: string) {
  try {
    const response = await axios.get<string>(url, {
      responseType: "arraybuffer",
    });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    return base64;
  } catch (error) {
    throw error;
  }
}

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
});

const defaultBucketParams = {
  Bucket: "gpttherapy",
  // Body: Buffer.from(base64Data, "base64"),
  // Key: convo.id,
  ContentEncoding: "base64",
  ContentType: "video/mp4",
};
export function s3PutBase64(body: string | Buffer, key: string) {
  s3.putObject(
    { ...defaultBucketParams, Body: body, Key: key },
    (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(
          "base64 logged here... should be added to bucket as well: ",
          data
        );
      }
    }
  );
}
