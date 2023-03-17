import {
  type ErrorBoundaryComponent,
  type LinksFunction, 
  json, 
  MetaFunction 
} from '@remix-run/node'

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react'

import { RecoilRoot } from 'recoil'
import { Header, Footer, Search, MobileNav, GA4 } from './components'
import { rootStyles } from './styles/root'
import { links as algoliaSearchLinks } from '~/components/search'
import { ogImagePath } from './config'

import styles from './styles/app.css'

export const meta: MetaFunction = () => {
  const title       = 'Pioneer Writings'
  const description = 'Let the dead speak through their works.'

  return {
    charset: 'utf-8',
    title,
    description,
    viewport: 'width=device-width,initial-scale=1, user-scalable=yes',
    'og:title': title,
    'og:description': description,
    'og:image': ogImagePath,
    'og:type': 'website'
  }
}

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap' },
  { rel: 'stylesheet', href: styles },
  ...algoliaSearchLinks()
]

export const loader = async () => {
  return json({
    env: {
      STRAPI_API_URL: process.env.STRAPI_API_URL,
      PREVIEW_SECRET: process.env.PREVIEW_SECRET,
      ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
      ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY,
      ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
      GA_TRACKING_ID: process.env.GA_TRACKING_ID,
      NODE_ENV: process.env.NODE_ENV
    }
  })
}

export default function App() {
  const { env } = useLoaderData<typeof loader>()

  return (
    <html lang='en-US'>
      <head>
        <Meta />
        <Links />
      </head>
      
      <body>
        <RecoilRoot>
          <GA4 
            trackingID={env.GA_TRACKING_ID!} 
            env={env.NODE_ENV}
          />

          <div className={rootStyles}>
            <Search />
            <Header />
            <MobileNav />
            <Outlet />
            <Footer />
          </div>
        </RecoilRoot>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{__html: 
            `window.env = ${JSON.stringify(env)}`
          }}>
        </script>
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
          <span className='mx-auto'>
            <img
              className='mx-auto mt-16 mb-6'
              src='/images/500.png'
              alt='A picture of the 10 horned leopard beast described in Daniel chapter 7.'
              tabIndex={0}
            />
          </span>
          <p role='alert' className='text-center font-bold'>
            Oh no! Something went terribly wrong.
          </p>
        </div>
        <Scripts />
      </body>
    </html>
  )
}