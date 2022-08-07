import { ActionFunction, LinksFunction, json } from '@remix-run/node'
import { useActionData, Form } from '@remix-run/react'
import styles from '~/styles/routes/search/search.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles }
]

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData()
  const query = data.get('q')

  return json(query ?? '')
}

export const meta = () => ({
  title: 'Pioneer Writings - Search'
})

export default function SearchPage(){
  const data = useActionData<typeof action>()
  const placeholder = 'Search all articles'

  return (
    <div className='search-page'>
      <Form method='post'>
        
        <div className='search-box' tabIndex={-1}>
          <input
            role='textbox'
            type='text'
            name='q'
            placeholder={placeholder}
          />

          <button aria-label='Submit query'>
            <img src='/images/search.svg' aria-hidden='true' />
          </button>
        </div>
      </Form>
    </div>
  )
}