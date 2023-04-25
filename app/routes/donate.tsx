import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction
} from '@remix-run/node'

import { useLoaderData, useFetcher, Link, useLocation } from '@remix-run/react'
import { ChangeEvent, useState, useRef, useEffect } from 'react'
import { Show } from '~/components'
import { styles } from '~/styles/routes/donate'
import { amountPickerStyles } from '~/styles/components/amountPicker'
import { stripe, stripekey } from '~/stripe.server'
import { loadStripe } from '@stripe/stripe-js'
import { formatValue } from '~/utils'
import { ogImagePath } from '~/config'

import Stripe from 'stripe'
import classNames from 'classnames'
import Spinner from 'react-spinner-material'

interface ExpandedPrice extends Stripe.Price {
  product: Stripe.Price['product'] & Record<string, any>
}

export const action: ActionFunction = async ({ request }) => {
  const url = request.url.replace('/donate', '')
  const data = await request.formData()

  const price = data.get('price') as string
  const other = Number(data.get('other') as string)

  const { id } = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${url}/donate?checkoutID={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/donate`,

    line_items: price
      ? [{ price, quantity: 1 }]
      : [
          {
            quantity: 1,
            amount: other,
            currency: 'usd',
            name: `One-time ${formatValue(other)} donation to Pioneer Writings`
          }
        ]
  })

  return { id }
}

export const loader: LoaderFunction = async ({ params }) => {
  const sid = params.sid

  if (sid) {
    const session = await stripe.checkout.sessions.retrieve(sid)
    return { session }
  }

  return {
    stripekey,
    prices: (
      await stripe.prices.list({
        limit: 3,
        expand: ['data.product']
      })
    ).data.reverse()
  }
}

interface Price {
  id: string
  amount: number
}

interface LoaderData {
  prices: ExpandedPrice[]
  stripekey: string
}

export const meta: V2_MetaFunction = () => {
  const title = 'Donate — Pioneer Writings'
  const description = 'Thank you for your supporting this ministry.'

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:image', content: ogImagePath }
  ]
}

export default function DonatePage() {
  const { search } = useLocation()
  const [donated] = useState(search.includes('checkoutID'))
  const [price, setPrice] = useState<Price>()
  const [amount, setAmount] = useState<string>('')
  const [editing, setEditing] = useState(false)
  const { state, data, submit, Form } = useFetcher()
  const { prices, stripekey } = useLoaderData<LoaderData>()

  const optionOtherSelected = price?.id === '0'
  const otherInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      otherInputRef?.current?.focus()
    }
  }, [editing])

  useEffect(() => {
    const checkout = async () => {
      if (data?.id) {
        const stripe = await loadStripe(stripekey)

        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.id
          })
          console.error(error)
        }
      }
    }
    checkout()
  }, [data])

  const handleContinue = () => {
    const method = 'post'

    if (price && price.id !== '0') {
      return submit({ price: price.id }, { method })
    }
    submit({ other: amount }, { method })
  }

  const handleAmountSelect = (price: Price) => setPrice(price)

  const handleOtherChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>
        {donated ? 'Thank you!' : ' We appreciate your support.'}
      </h1>

      <p className={styles.description}>
        {donated
          ? `From the bottom of our hearts, thank you for
           your support and belief in our mission. God bless you!
          `
          : `If this service has been a blessing to you, please
          consider helping us with a monetary contribution.`}
      </p>

      <Show when={!donated}>
        <Form action='/?index' className='mt-8 flex flex-col justify-center'>
          <h2 className='mb-4 font-bold text-center'>
            Select a one-time amount
          </h2>

          <div
            className='border border-black rounded-xl flex'
            role='radiogroup'
            aria-label='Select a one time amount'
            tabIndex={-1}>
            {prices.map(({ id, product, unit_amount }, i) => {
              const checked = id === price?.id

              return (
                <label
                  tabIndex={0}
                  key={id}
                  className={classNames(
                    amountPickerStyles.button,
                    checked ? amountPickerStyles.selected : '',
                    i === 0 ? 'rounded-l-xl' : ''
                  )}>
                  {product.metadata.label}

                  <input
                    type='radio'
                    className='appearance-none'
                    name='amount'
                    id={id}
                    onChange={() => {
                      if (unit_amount) {
                        handleAmountSelect({
                          id,
                          amount: unit_amount
                        })
                      }
                    }}
                    tabIndex={-1}
                    aria-checked={checked}
                    checked={checked}
                  />
                </label>
              )
            })}

            <label
              tabIndex={0}
              onClick={() => setEditing(true)}
              className={classNames(
                amountPickerStyles.button,
                'other rounded-r-xl',
                optionOtherSelected ? amountPickerStyles.selected : ''
              )}>
              Other
              <input
                type='radio'
                className='appearance-none'
                name='amount'
                value={0}
                id='0'
                onChange={() => {
                  handleAmountSelect({ id: '0', amount: 0 })
                }}
                aria-checked={optionOtherSelected}
                checked={optionOtherSelected}
                tabIndex={-1}
              />
            </label>
          </div>

          <Show when={editing}>
            <input
              ref={otherInputRef}
              type='number'
              placeholder='$0.00'
              className={styles.input}
              defaultValue={amount}
              onChange={handleOtherChange}
              onBlur={() => setEditing(false)}
            />
          </Show>

          <Show when={optionOtherSelected && !editing}>
            <input
              type='text'
              className={styles.input}
              value={formatValue(Number(amount))}
              onFocus={() => setEditing(true)}
              readOnly
            />
          </Show>

          <Show when={state === 'idle'}>
            <button
              onClick={handleContinue}
              type='button'
              className={styles.continueButton}
              disabled={!price}>
              Continue
              <img className='ml-2' src='/images/right-arrow.svg' aria-hidden />
            </button>
          </Show>

          <Show when={state === 'submitting'}>
            <Spinner
              visible
              color='#000'
              stroke={2}
              radius={30}
              className='mx-auto mt-6'
            />
          </Show>
        </Form>
      </Show>

      <Show when={donated}>
        <Link to='/' className={styles.goHome}>
          Go Home
          <img src='/images/right-arrow.svg' aria-hidden className='ml-2' />
        </Link>
      </Show>
    </div>
  )
}
