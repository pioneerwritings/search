import { FC, ReactElement } from 'react'
import { RecoilRoot, RecoilRootProps } from 'recoil'
import { render, RenderOptions } from '@testing-library/react'

const Provider: FC<RecoilRootProps> = ({ children }) => {
  return ( <RecoilRoot>{children}</RecoilRoot> )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Provider, ...options })

export { customRender as render }
export * from '@testing-library/react'