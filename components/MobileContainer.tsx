import { PropsWithChildren } from 'react'

export default function MobileContainer({children}: PropsWithChildren) {
  return (
    <div className='h-dvh w-full flex flex-col max-w-md mx-auto relative bg-background'>
      {children}
    </div>
  )
}
