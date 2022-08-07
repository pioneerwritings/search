import type { MetaFunction } from '@remix-run/node'
import { ErrorBoundaryComponent } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import { Header, HeaderLinks } from './components'
import styles from './styles/global/app.css'
import globals from './styles/global/global.css'
import reset from './styles/global/reset.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Pioneer Writings',
  viewport: 'width=device-width,initial-scale=1, user-scalable=yes',
})

export const links = () => [
  ...HeaderLinks(),
  { rel: 'stylesheet', href: reset },
  { rel: 'stylesheet', href: globals },
  { rel: 'stylesheet', href: styles },
]

export default function App() {
  return (
    <html lang='en-US'>
      <head>
        <Meta />
        <Links />
      </head>
      
      <body>
        <div className='app'>
          <Header />
          <Outlet />
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