import { useEffect } from 'react'
import { useLocation } from '@remix-run/react'
import { useRecoilValue } from 'recoil'
import { GA4State } from '~/state'

export const useGoogleAnalytics = () => {
  const { pathname } = useLocation()
  const GA4 = useRecoilValue(GA4State)

  useEffect(() => GA4?.pageview(pathname), 
    [ GA4, pathname ]
  )

  return { GA4 }
}