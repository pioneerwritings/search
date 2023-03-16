import { CustomWindow } from '~/types'
declare const window: CustomWindow

export const useEnv = () => {
  return typeof window !== 'undefined' ? window.env : process.env
}