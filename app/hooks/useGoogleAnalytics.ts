import GA4ReactResolveInterface, { GA4React } from 'ga-4-react'
import { useState, useEffect } from 'react'
import { useLocation } from '@remix-run/react'
import { useEnv } from '~/hooks'

export const useGoogleAnalytics = (): { GA4: GA4ReactResolveInterface } => {
  const [ GA4, setGA4 ] = useState<any>()
  const { pathname } = useLocation()

  useEffect(() => {
    const { GA_TRACKING_ID, NODE_ENV } = useEnv()
    const id  = GA_TRACKING_ID!
    const prod = NODE_ENV !== 'production'

    const g4react = new GA4React(id, { 
      debug_mode: !prod 
    })

    if(prod){
      g4react.initialize()
      .then((ga4: any) => setGA4(ga4))
      .catch(err => console.error(err))
    }
  }, [])

  useEffect(() => {
    const { NODE_ENV } = useEnv()
    const prod = NODE_ENV !== 'production'

    if(GA4 && prod){
      GA4?.pageview(pathname)
    }
  }, [ GA4, pathname ])

  return { GA4 }
}