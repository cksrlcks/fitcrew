import { PropsWithChildren } from 'react'

export default function MobileContainer({children}: PropsWithChildren) {
  return (
    <div className='h-dvh w-full flex flex-col max-w-md mx-auto relative bg-background overflow-y-auto overflow-x-hidden scrollbar-hide'>
      {children}
    </div>
  )
}
