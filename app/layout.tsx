import './globals.css'
import Image from 'next/image'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="wrapper">
          {children}
        </div>
        <footer className="footer">
          <span>Powered by</span>
          <a 
            href="https://layerx.xyz"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Image
              alt="code available on github" 
              width="100" 
              height="50" 
              src="/layerx.svg" 
            />
           </a>
        </footer>
      </body>
    </html>
  )
}
