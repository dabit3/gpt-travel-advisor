import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest) => {
  const { membershipId } = (await req.json()) as { membershipId: string };

  if (!membershipId) {
    return new Response(JSON.stringify({ msg: "Message ID is empty", data: [] }), {
      status: 400,
    });
  }

  const res = await fetch(`https://api.whop.com/api/v2/memberships/${membershipId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.WHOP_API_KEY}`,
    }
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ msg: "Whop API error", data: [] }), {
      status: 500,
    });
  }

  const data = await res.json();

  return new Response(JSON.stringify({ data: data }));
};

export default handler;