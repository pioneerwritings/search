import { PropsWithChildren } from 'react'
import { Show } from '~/components'

interface Props extends PropsWithChildren {
  type: 'Articles' | 'Series'
}

export const ResultsList = ({ children, type }: Props) => {
  return (
    <output>
      <Show when={!!children}>{children}</Show>
    </output>
  )
}