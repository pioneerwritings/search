import { ActionArgs, json } from "@remix-run/node"
import { Form, useActionData, useTransition } from "@remix-run/react"
import { InputHTMLAttributes } from "react"
import { Show } from "~/components"

import Classnames from 'classnames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  textarea?: boolean
  wrapperClass?: string
  error?: string
}

interface ActionResponse {
  success: boolean
  errors?: {
    [name: string]: string
  }
  form?: {
    [key: string]: FormDataEntryValue
  }
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const errors: ActionResponse['errors'] = {}
  const nodemailer = require('nodemailer')

  const firstname = form.get('first name')
  const lastname = form.get('last name')
  const email = form.get('email')
  const message = form.get('message')

  for(const field of form.entries()){
    const [name, value ] = field

    if(!value) {
      errors[name] = `${name} is required.`
    }
  }

  if(Object.keys(errors).length >= 1){
    return json<ActionResponse>({
      success: false, 
      errors,
      form: Object.fromEntries(form)
    })
  }

  const transport = nodemailer.createTransport({
    secure: true,
    port: 465,
    host: 'smtp.gmail.com',

    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  })

  try {
    await transport.sendMail({
      from: email as string,
      to: 'pioneerwritings@gmail.com',
      subject: `New message from pioneerwritings.com`,
      html: `
        <html>
          <head>
            <meta charset="utf-8">
          </head>

          <body>
            <p>
              <strong>Name</strong>: ${firstname} ${lastname} <br />
              <strong>Email</strong>: ${email}
            </p>

            <hr style='margin: 2rem 0; border:none; background-color: #E3E3E3; height: 1px; max-width:500px;' />

            <p style='max-width:500px;'>${message}</p>
          </body>
        </html>
      `
    })

    return json<ActionResponse>({
      success: true
    })
  }
  catch(error){
    console.log('Email failed.', error)

    return json<ActionResponse>({
      success: false
    })
  }
}

export default function ContactPage(){
  const data = useActionData<typeof action>()
  const transition = useTransition()
  const isSubmitting = transition.state === 'submitting'

  const Input = (props: InputProps) => {
    const { name, className, wrapperClass, textarea, error } = props
    const defaultValue = name && data?.form && data.form[name]
    
    const inputStyles = `
      border 
      border-gray-300 
      rounded-lg 
      px-4 
      py-3 
      focus:ring focus:ring-3 ring-cornflower
      outline-0
    `

    const containerClasses = Classnames(
      'relative flex flex-col', {
      [wrapperClass as string]: !!wrapperClass,
    })

    const inputClasses = Classnames(
      inputStyles, {
        [className as string]: !!className,
        'border-red-500': error
      }
    )

    const textareaClasses = Classnames(
      inputClasses, 'resize-none'
    )

    return (
      <div className={containerClasses}>
        <label className='capitalize mb-1 text-gray-600 font-medium text-xs pl-4' htmlFor={name}>
          {name}
        </label>
        
        <Show when={!!textarea}>
          <textarea 
            className={textareaClasses} 
            placeholder={props.placeholder}
            name={name}
            defaultValue={defaultValue as string}
          />
        </Show>

        <Show when={!textarea}>
          <input 
            name={name} 
            placeholder={props.placeholder} 
            className={inputClasses}
            defaultValue={defaultValue as string}
          />
        </Show>

        <Show when={!!error}>
          <span className='text-red-500 text-xs pl-4 mt-1'>
            {error}
          </span>
        </Show>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen pt-16 pb-36 px-8 antialiased flex flex-col items-center'>
      <h1 className='leading-tight text-center font-heldane-bold text-3xl md:text-[2.5rem] antialiased mb-4'>
        { data?.success ? 'Success!' : 'Well Hello There.' }
      </h1>

      <p className='max-w-xl text-center antialiased font-light'>
        {
          data?.success ? 
          'Thank you for your interest in Pioneer Writings. We\'ll get back to you as soon as possible. God bless you!' : 
          `If you have any questions about what we're doing, our mission, or just want to say hello, feel free to send us a message!`
        }
      </p>

      <Form method='post' className='mt-12 border border-gray-200 rounded-xl w-full max-w-lg p-8'>
        <div className='md:flex md:items-center md:justify-between'>
          <Input
            type='text'
            placeholder="First name"
            name="first name"
            aria-label="Enter your first name"
            wrapperClass='mb-4 md:mr-4 md:mb-0'
            error={data?.errors && data.errors['first name']}
          />

          <Input 
            type='text' 
            placeholder="Last name" 
            name="last name" 
            aria-label="Enter your last name"
            error={data?.errors && data.errors['last name']}
          />
        </div>

        <Input 
          type='email' 
          placeholder="Please enter your email" 
          name='email' 
          aria-label="Enter your email"
          wrapperClass="w-full mt-4"
          error={data?.errors && data.errors['email']}
        />

        <Input 
          textarea
          placeholder="What would you like to say?" 
          name='message' 
          aria-label="What would you like to say?"
          wrapperClass="w-full mt-4"
          className="h-40"
          error={data?.errors && data.errors['message']}
        />

        <button 
          type='submit' 
          className='w-full px-4 py-6 text-center bg-black rounded-lg text-white font-extrabold mt-8 focus:ring focus:ring-3 ring-cornflower outline-0'
          disabled={isSubmitting}>
          {isSubmitting ? 'LOADING' : 'SUBMIT'}
        </button>
      </Form>
    </div>
  )
}