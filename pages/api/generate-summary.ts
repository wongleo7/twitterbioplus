import { TextType } from '../../components/generate-summary'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const config = {
  runtime: 'edge'
}

const handler = async (req: Request): Promise<Response> => {
  const { article, type } = (await req.json()) as {
    article?: string
    type?: TextType
  }

  const prompt =
    type === 'Interview'
      ? `You are an interviewer and this is the transcript of the interview you just had. Provide a summary of the conversation you just had and include labels for all of the candidate's skills for future reference and searching. Have the summary and labels clearly labeled. Have the label clearly numbered ('1.', '2.', etc): ${article}${
          article?.slice(-1) === '.' ? '' : '.'
        }`
      : `Provide a summary of the article below and include a list of labels for future reference and for searching. Label the summary as 'Summary:' and labels as 'Labels:'. The list is to be numbered ('1.', '2.', etc): ${article}${
          article?.slice(-1) === '.' ? '' : '.'
        }`

  if (!prompt || !article) {
    return new Response('No prompt in the request', { status: 400 })
  }

  const payload: OpenAIStreamPayload = {
    model: 'text-davinci-003',
    prompt,
    temperature: 0.2,
    max_tokens: 500,
    stream: true,
    n: 1
  }

  console.log(payload)

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}

export default handler
