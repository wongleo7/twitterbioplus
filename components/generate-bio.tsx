import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import DropDown from '../components/DropDown'
import LoadingDots from '../components/LoadingDots'
import ResizablePanel from '../components/ResizablePanel'

export type VibeType = 'Professional' | 'Casual' | 'Funny'

const GenerateBio = () => {
  const [loading, setLoading] = useState(false)
  const [bio, setBio] = useState('')
  const [vibe, setVibe] = useState<VibeType>('Professional')
  const [generatedBios, setGeneratedBios] = useState<String>('')

  const generateBio = async (e: any) => {
    e.preventDefault()
    setGeneratedBios('')
    setLoading(true)
    const response = await fetch('/api/generate-bio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bio,
        vibe
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
      setGeneratedBios((prev) => prev + chunkValue)
    }

    setLoading(false)
  }

  return (
    <div className='flex mx-auto flex-col items-center justify-center py-2'>
      <div className='max-w-xl w-full'>
        <div className='flex mt-10 items-center space-x-3'>
          <Image src='/1-black.png' width={30} height={30} alt='1 icon' className='mb-5 sm:mb-0' />
          <p className='text-left font-medium'>
            Copy your current bio <span className='text-slate-500'>(or write a few sentences about yourself)</span>.
          </p>
        </div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5'
          placeholder={
            'e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com.'
          }
        />
        <div className='flex mb-5 items-center space-x-3'>
          <Image src='/2-black.png' width={30} height={30} alt='1 icon' />
          <p className='text-left font-medium'>Select your vibe.</p>
        </div>
        <div className='block'>
          <DropDown
            selected={vibe}
            setSelected={(newVibe: VibeType) => setVibe(newVibe)}
            choices={['Professional', 'Casual', 'Funny']}
          />
        </div>

        {!loading && (
          <button
            className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
            onClick={(e) => generateBio(e)}
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
            {generatedBios && (
              <>
                <div>
                  <h2 className='sm:text-4xl text-3xl font-bold text-slate-900 mx-auto'>Your generated bios</h2>
                </div>
                <div className='space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto'>
                  {generatedBios
                    .substring(generatedBios.indexOf('1') + 3)
                    .split('2.')
                    .map((generatedBio) => {
                      return (
                        <div
                          className='bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border'
                          onClick={() => {
                            navigator.clipboard.writeText(generatedBio)
                            toast('Bio copied to clipboard', {
                              icon: '✂️'
                            })
                          }}
                          key={generatedBio}
                        >
                          <p>{generatedBio}</p>
                        </div>
                      )
                    })}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </ResizablePanel>
    </div>
  )
}

export default GenerateBio
