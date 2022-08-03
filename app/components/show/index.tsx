import { FC } from 'react'

interface Props {
  when: boolean
}

export const Show: FC<Props> = ({ children, when }) => {
  return (<>{!!when && children}</>)
}