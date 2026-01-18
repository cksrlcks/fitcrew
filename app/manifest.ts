import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fitcrew',
    short_name: 'Fitcrew',
    description: '같이 관리하는 체중 관리 앱',
    start_url: 'https://fitcrew.vercel.app',
    scope: 'https://fitcrew.vercel.app',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}