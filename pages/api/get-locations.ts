// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  locations: any,
}

const GS_KEY = process.env.GS_KEY

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  let { pointsOfInterest, city } = JSON.parse(req.body)
  pointsOfInterest = JSON.parse(pointsOfInterest)

  const locations: {}[] = []
  await Promise.all(pointsOfInterest.map(async point => {
    try {
      const GSURL = `https://www.googleapis.com/customsearch/v1?key=${GS_KEY}&cx=6573f103116714e0d&q=${point + ' in ' + city}`

      const response = await fetch(GSURL)
      const location = await response.json()
      console.log('location: ', location)

      if (location) {
        locations.push(location.items[0])
      }
    } catch (err) {
      console.log('error: ', err)
    }
  }))

  res.status(200).json({
    locations,
  })
}
