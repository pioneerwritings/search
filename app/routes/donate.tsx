import { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ScrollTop } from '~/components'
import { styles } from '~/styles/routes/donate'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

export const loader: LoaderFunction = () => {
  return {
    options: {
      'client-id': process.env.PAYPAL_CLIENT_ID,
      components: 'buttons',
    },
    buttons: {
      fundingSource: 'paypal',
      style: {
        color: 'white',
        layout: 'horizontal',
        label: 'paypal',
        shape: 'pill',
        height: 50,
        tagline: true
      }
    }
  }
}

export default function DonatePage(){
  const { options, buttons } = useLoaderData()

  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>
        We appreciate your support.
      </h1>

      <p className={styles.description}>
        If this service has been a blessing to you, please
        consider helping us with a monetary contribution.
      </p>

      <div className='w-72 md:w-80  mt-8'>
        <PayPalScriptProvider options={{ ...options }}>
          <PayPalButtons { ...buttons } />
        </PayPalScriptProvider>
      </div>

      <ScrollTop />
    </div>
  )
}