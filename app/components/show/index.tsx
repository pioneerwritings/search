import type { FC } from 'react'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  when: boolean
}

export const Show: FC<Props> = ({ children, when }) => {
  return (<>{!!when && children}</>)
}