import { Tab } from '@headlessui/react'

type Tab = {
  title: string
  content: React.ReactNode
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Tabs({ items }: { items: Tab[] }) {
  return (
    <div className='w-full max-w-md px-2 py-16 sm:px-0'>
      <Tab.Group>
        <Tab.List className='flex space-x-1 rounded-xl bg-blue-900/20 p-1'>
          {items.map(({ title }) => (
            <Tab
              key={title}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ',
                  selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='mt-2'>
          {items.map(({ title, content }) => (
            <Tab.Panel
              key={title}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
              )}
            >
              <ul>{content}</ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
