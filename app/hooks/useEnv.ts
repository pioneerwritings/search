import { CustomWindow } from '~/types'
declare const window: CustomWindow

export const useEnv = () => {
  return typeof window === 'undefined' ? process.env : window.env
}