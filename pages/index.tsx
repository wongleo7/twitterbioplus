import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import GenerateBio from '../components/generate-bio'
import GenerateSummary from '../components/generate-summary'
import Tabs from '../components/Tabs'

const Home: NextPage = () => {
  return (
    <div className='flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>OpenAI Concept</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20'>
        <h1 className='sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900'>Generate with OpenAI</h1>
        <Tabs
          items={[
            {
              title: 'Generate Summary',
              content: <GenerateSummary />
            },
            {
              title: 'Generate Bio',
              content: <GenerateBio />
            }
          ]}
        />
      </main>
      <Footer />
    </div>
  )
}

export default Home
