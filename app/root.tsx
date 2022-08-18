import type { LinksFunction, MetaFunction } from '@remix-run/node'
import type { ErrorBoundaryComponent } from '@remix-run/node'

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import { Header, Footer } from './components'
import { rootStyles } from './styles/root'
import styles from './styles/app.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Pioneer Writings',
  viewport: 'width=device-width,initial-scale=1, user-scalable=yes',
})

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap' },
  { rel: 'stylesheet', href: styles }
]

export default function App() {
  return (
    <html lang='en-US'>
      <head>
        <Meta />
        <Links />
      </head>
      
      <body>
        <div className={rootStyles}>
          <Header />
          <Outlet />
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error.message)

  return (
    <html>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>

      <body>
        <div className='error-boundary'>
          <span className='overlay'>
            <img
              src='/images/500.png'
              alt='A picture of the 10 horned leopard beast described in Daniel chapter 7.'
              tabIndex={0}
            />
          </span>
          <p role='alert'>Oh no! Something went terribly wrong.</p>
        </div>
        <Scripts />
      </body>
    </html>
  )
}