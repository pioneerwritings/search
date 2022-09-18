import { ScrollTop } from "../scrollTop"
import { useRecoilState } from 'recoil'
import { footerState } from "~/state"
import { Show } from '~/components'
import { styles } from '~/styles/components/footer'

import classnames from 'classnames'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [ { active, bottom } ] = useRecoilState(footerState)

  const height = active ? 'h-48' : 'h-20'

  return (
    <footer className={classnames(styles.container, height)}>
      <ScrollTop fixed={!bottom} />

      <Show when={active}>
        <div className={styles.copyright}>
          <p><strong>© {currentYear}</strong> Pioneer Writings.</p>
        </div>
      </Show>
    </footer>
  )
}