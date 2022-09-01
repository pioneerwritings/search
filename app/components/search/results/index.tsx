import { Fragment, useState } from 'react'
import { ResultsList } from './list'
import { ResultsPanel } from './panel'
import { Show } from '~/components'
import { contentListStyles } from '~/styles/components/autoComplete/contentList'
import { contentTabStyles } from '~/styles/components/autoComplete/contentTab'


type ContentTab = 'articles' | 'series'

export const Results = (props: { tabs: ContentTab[], data: Record<ContentTab, any> }) => {
  const [ currentTab, setCurrentTab ] = useState<ContentTab>('articles')
  const { tabs, data } = props

  return (
    <Fragment>
      <div role='tablist' className={contentListStyles}>
        {
          tabs.map((tab) => {
            if(data[tab]){
              return (
                <button
                  key={tab}
                  className={contentTabStyles}
                  role='tab'
                  aria-label={tab}
                  aria-controls='results'
                  aria-selected={currentTab === tab}
                  onClick={() => setCurrentTab(tab)}>
                  {tab}
                </button>
              )
            }
            return undefined
          })
        }
      </div>

      <ResultsPanel>
        <Show when={currentTab === 'articles'}>
          <ResultsList type='Articles'>
            {data.articles?.props.children}
          </ResultsList>
        </Show>
        
        <Show when={currentTab === 'series'}>
          <ResultsList type='Series'>
            {data.series?.props.children}
          </ResultsList>
        </Show>
      </ResultsPanel>
    </Fragment>
  )
}