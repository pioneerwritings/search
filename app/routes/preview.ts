import { json, LoaderFunction, redirect } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  const queries = new URL(request.url).searchParams

  console.log({ queries })
  const secret = queries.get('secret')
  const url = process.env.STRAPI_API_URL as string
  const id = queries.get('id')

  if(!secret){
    return json(
      'Unauthorized access: secret not provided', {
        status: 401
    })
  }
  if(secret !== process.env.PREVIEW_SECRET){
    return json(
      'Unauthorized access: secret is incorrect', {
        status: 401
    })
  }
  if(!id){
    return json(
      'Unauthorized access: id not provided', {
        status: 401
    })
  }

  const res = await fetch(
    `${url}/articles/${id}?publicationState=preview`
  )

  const article = await res.json()

  if(!article.data){
    return json(
      'Unauthorized access: article not found', {
        status: 401
    })
  }
  return redirect(`/articles/${id}?preview=active`)
}