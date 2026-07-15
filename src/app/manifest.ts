import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CED Escuela',
    short_name: 'CED',
    description: 'Sistema de gestión escolar para primaria',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0d1a',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
