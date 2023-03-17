import { atom } from 'recoil'
import { GA4ReactResolveInterface } from 'ga-4-react/dist/models/gtagModels'

interface SearchState {
  active: boolean
  query: string
  results: any[]
}

interface FooterState {
  active: boolean
  bottom: boolean
}

interface NavState {
  active: boolean
}

export const GA4State = atom<GA4ReactResolveInterface>({
  key: 'GA4',
  default: undefined
})

export const searchState = atom<SearchState>({
  key: 'search',
  default: {
    active: false,
    query: '',
    results: []
  }
})

export const footerState = atom<FooterState>({
  key: 'footerState',
  default: {
    active: true,
    bottom: true
  }
})

export const navState = atom<NavState>({
  key: 'navState',
  default: { active: false }
})