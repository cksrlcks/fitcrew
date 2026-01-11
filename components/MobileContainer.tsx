import React, { PropsWithChildren } from 'react'

export default function MobileContainer({children}: PropsWithChildren) {
  return (
    <div className='h-screen w-full flex flex-col max-w-md mx-auto relative bg-white overflow-hidden'>
        <div className='flex-1 overflow-y-auto pb-20'>
            {children}
        </div>
    </div>
  )
}
