import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import { Header, HeaderLinks } from './components'
import styles from '../build/scss/global.css'
import reset from '../build/scss/reset.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Pioneer Writings',
  viewport: 'width=device-width,initial-scale=1, user-scalable=yes',
})

export const links = () => [
  ...HeaderLinks(),
  { rel: 'stylesheet', href: reset },
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
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
