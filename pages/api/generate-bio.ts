import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const config = {
  runtime: 'edge'
}

const handler = async (req: Request): Promise<Response> => {
  const { bio, vibe } = (await req.json()) as {
    bio?: string
    vibe?: string
  }

  const prompt =
    vibe === 'Funny'
      ? `Generate 2 funny twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated bio is at max 20 words and base it on this context: ${bio}${
          bio?.slice(-1) === '.' ? '' : '.'
        }`
      : `Generate 2 ${vibe} twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure each generated bio is at least 14 words and at max 20 words and base them on this context: ${bio}${
          bio?.slice(-1) === '.' ? '' : '.'
        }`

  if (!prompt) {
    return new Response('No prompt in the request', { status: 400 })
  }

  const payload: OpenAIStreamPayload = {
    model: 'text-davinci-003',
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}

export default handler
