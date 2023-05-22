import { type LinksFunction, json, type V2_MetaFunction } from '@remix-run/node'

import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError
} from '@remix-run/react'

import { RecoilRoot } from 'recoil'
import { Header, Footer, Search, MobileNav, GA4, Show } from './components'
import { rootStyles } from './styles/root'
import { links as algoliaSearchLinks } from '~/components/search'
import { ogImagePath } from './config'

import tailwind from './tailwind.css'

export const meta: V2_MetaFunction = () => {
  const title = 'Pioneer Writings'
  const description = 'Let the dead speak through their works.'

  return [
    { title },
    { charSet: 'utf-8' },
    {
      name: 'og:type',
      content: 'Website'
    },
    {
      name: 'description',
      content: description
    },
    {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,user-scalable=yes'
    },
    {
      name: 'description',
      content: 'The latest updates and news from the Pioneer Writings team.'
    },
    {
      property: 'og:image',
      content: ogImagePath
    }
  ]
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwind },
  ...algoliaSearchLinks()
]

export function headers() {
  return {
    'Cache-Control':
      's-max-age=2592000, stale-while-revalidate=86400, stale-if-error=604800'
  }
}

export const loader = async () => {
  return json({
    env: {
      STRAPI_API_URL: process.env.STRAPI_API_URL,
      PREVIEW_SECRET: process.env.PREVIEW_SECRET,
      ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
      ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY,
      ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
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
        <link rel='preconnect' href='https://rsms.me/' />
        <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
      </head>

      <body>
        <RecoilRoot>
          <GA4 trackingID={env.GA_TRACKING_ID!} env={env.NODE_ENV} />

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
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`
          }}></script>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()

  return (
    <html>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>

      <body className='px-10'>
        <div className='border border-gray-300 rounded-xl max-w-xl mx-auto my-40 p-10'>
          {isRouteErrorResponse(error) ? (
            <>
              <span className='text-xs text-black font-extrabold inline-block'>
                {error.status} Error
              </span>

              <h1 className='font-extrabold text-xl lg:text-3xl mb-3'>
                Oops! Something went wrong.
              </h1>

              <p className='text-red'>Error: {error.statusText}</p>
            </>
          ) : error instanceof Error ? (
            <>
              <span className='text-xs text-black font-extrabold inline-block'>
                500 Error
              </span>

              <h1 className='font-extrabold text-xl lg:text-3xl mb-3'>
                Oops! Something went wrong.
              </h1>

              <p className='text-red mb-3'>{error.message}</p>

              <div className='overflow-x-auto'>
                <code className='text-sm wrap text-gray-600'>
                  <pre>{error.stack}</pre>
                </code>
              </div>
            </>
          ) : null}
        </div>
        <Show when={isRouteErrorResponse(error)}></Show>

        <Scripts />
      </body>
    </html>
  )
}
