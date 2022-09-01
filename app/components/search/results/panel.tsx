import { PropsWithChildren } from 'react'

export const ResultsPanel = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-[500px] overflow-auto" role='tabpanel' id='results'>
      {children}
    </div>
  )
}