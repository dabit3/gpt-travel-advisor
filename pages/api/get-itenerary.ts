// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string,
  pointsOfInterestPrompt: any,
  itenerary: any,
}

const GPT_KEY = process.env.GPT_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${GPT_KEY}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let days = 4, city = 'Rio'
  if (req.body) {
    let body = JSON.parse(req.body)
    days = body.days
    city = body.city
  }

  let basePrompt = `what is an ideal itenerary for ${days} days in ${city}?`
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 600
      })
    })
    const itenerary = await response.json()
    const pointsOfInterestPrompt = 'Extract the main points of interest out of this text without any additional words, separated by commas: ' + itenerary.choices[0].text

    res.status(200).json({
      message: 'success',
      pointsOfInterestPrompt,
      itenerary: itenerary.choices[0].text
    })

  } catch (err) {
    console.log('error: ', err)
  }
}
