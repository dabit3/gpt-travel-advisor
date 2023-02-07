// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIStream, OpenAIStreamPayload } from '@/utils/OpenAIStream'

export const config = {
  runtime: "edge",
}

const handler = async (req: Request): Promise<Response> => {
  let { days = 4, city = 'Rio' } = (await req.json()) as {
    days?: number;
    city?: string;
  }

  if (days > 10) {
    days = 10
  }

  let basePrompt = `What is an ideal itinerary for ${days} days in ${city}? Describe my days as a guide and put the points of interest name linked to google url search of that point of interest (e.g. <a href="https://www.google.com/search?q=point+of+interest) rel="no-opener" target="_blank">POINTS OF INTEREST NAME</a>">`

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt: basePrompt,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 550,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

export default handler;