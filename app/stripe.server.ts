import Stripe from 'stripe'

const env = process.env.NODE_ENV
const dev = env !== 'production'

export const stripekey = ( dev ?
  process.env.STRIPE_PUBLIC_KEY_DEV :
  process.env.STRIPE_PUBLIC_KEY_PROD
)

const secretkey = ( dev ? 
  process.env.STRIPE_SECRET_KEY_DEV :
  process.env.STRIPE_SECRET_KEY_PROD
) as string

export const stripe = new Stripe (
  secretkey, {
    apiVersion: '2020-08-27',
    typescript: true
  }
)