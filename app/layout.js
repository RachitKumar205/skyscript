import { Inter } from 'next/font/google'
import './globals.css'
import {Providers} from "./providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SkyScript',
  description: 'Get updated, instantly',
}

export default function RootLayout({ children }) {
  return (
      <>
          <head>
              <link rel="preconnect" href="https://fonts.googleapis.com"/>
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
              <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&family=Quicksand&display=swap" rel="stylesheet"/>
          </head>
      <html lang="en">
        <body className="dark bg-zinc-900 h-full">
          {children}
        </body>
      </html>
      </>
  )
}
