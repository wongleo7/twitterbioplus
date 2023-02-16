import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import LoadingDots from './LoadingDots'
import ResizablePanel from './ResizablePanel'
import DropDown from './DropDown'

export type TextType = 'Interview' | 'Article'

const GenerateSummary = () => {
  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState('')
  const [textType, setTextType] = useState<TextType>('Interview')
  const [response, setResponse] = useState<string>('')
  const [generatedSummary, setGeneratedSummary] = useState<string>('')
  const [generatedLabels, setGeneratedLabels] = useState<string[]>([])
  const labelStartRegex = /Labels:[\n.]*/
  const labelRegex = /(\d\..*?\n)/

  useEffect(() => {
    let summaryPart = labelStartRegex.exec(response)
    if (!summaryPart) {
      setGeneratedSummary(response)
      setGeneratedLabels([])
      return
    }
    let labels = response
      .substring(summaryPart.index)
      .split(labelRegex)
      .map((x) => x.replace('\n', ''))
      .filter((x) => x.match(/^\d\..+$/))
      .map((x) => x.replace(/\d\.\s*/, ''))
    setGeneratedSummary(response.substring(0, summaryPart.index).replace('Summary:', ''))
    setGeneratedLabels(labels)
  }, [response])

  const generateSummary = async (e: any) => {
    e.preventDefault()
    setResponse('')
    setGeneratedSummary('')
    setGeneratedLabels([])
    setLoading(true)
    const response = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        article,
        textType
      })
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setResponse((prev) => prev + chunkValue)
    }

    setLoading(false)
  }

  return (
    <div className='flex mx-auto flex-col items-center justify-center py-2'>
      <div className='max-w-xl w-full'>
        <div className='flex mt-10 items-center space-x-3'>
          <Image src='/1-black.png' width={30} height={30} alt='1 icon' className='mb-5 sm:mb-0' />
          <p className='text-left font-medium'>Paste an article you would like to summarize.</p>
        </div>
        <textarea
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          rows={4}
          className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5'
          placeholder={'e.g. An interview, a news article, etc'}
        />
        <div className='flex mb-5 items-center space-x-3'>
          <Image src='/2-black.png' width={30} height={30} alt='1 icon' />
          <p className='text-left font-medium'>Select your article type.</p>
        </div>
        <div className='block'>
          <DropDown
            selected={textType}
            setSelected={(newText: TextType) => setTextType(newText)}
            choices={['Interview', 'Article']}
          />
        </div>

        {!loading && (
          <button
            className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
            onClick={(e) => generateSummary(e)}
          >
            Generate your bio &rarr;
          </button>
        )}
        {loading && (
          <button
            className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
            disabled
          >
            <LoadingDots color='white' style='large' />
          </button>
        )}
      </div>
      <Toaster position='top-center' reverseOrder={false} toastOptions={{ duration: 2000 }} />
      <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
      <ResizablePanel>
        <AnimatePresence mode='wait'>
          <motion.div className='space-y-10 my-10'>
            {generatedSummary && (
              <>
                <div>
                  <h2 className='sm:text-4xl text-3xl font-bold text-slate-900 mx-auto'>Your generated summary</h2>
                </div>
                <div className='space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto'>
                  <div
                    className='bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border'
                    onClick={() => {
                      navigator.clipboard.writeText('summary')
                      toast('Bio copied to clipboard', {
                        icon: '✂️'
                      })
                    }}
                    key={'summary'}
                  >
                    <p>{generatedSummary}</p>
                  </div>
                  <div>
                    <p className='text-left font-medium w-full'>Labels:</p>
                    <div className='flex flex-wrap mt-2'>
                      {generatedLabels.map((label) => {
                        return (
                          <div
                            className='bg-white rounded-xl m-2 shadow-md p-4 hover:bg-gray-100 transition cursor-copy border'
                            onClick={() => {
                              navigator.clipboard.writeText(label)
                              toast('Bio copied to clipboard', {
                                icon: '✂️'
                              })
                            }}
                            key={label}
                          >
                            <p>{label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </ResizablePanel>
    </div>
  )
}

export default GenerateSummary
