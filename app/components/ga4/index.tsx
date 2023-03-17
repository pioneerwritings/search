import { useEffect } from 'react'
import { GA4React } from 'ga-4-react'
import { useRecoilState } from 'recoil'
import { GA4State } from '~/state'

interface GA4Props {
  trackingID: string
  env: string
}

export const GA4 = ({ env, trackingID, }: GA4Props) => {
  const [GA4, setGA4] = useRecoilState(GA4State)

  useEffect(() => {
    const prod = (env === 'production')

    if(prod && !GA4){
      const g4react = new GA4React(trackingID, {
        debug_mode: false
      })

      g4react.initialize()
      .then((ga4) => setGA4(ga4))
      .catch(err => console.error(err))
    }
  }, [])

  return null
}