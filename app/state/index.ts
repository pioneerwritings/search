import { atom } from 'recoil'

interface SearchState {
  active: boolean
  query: string
  results: any[]
}

interface FooterState {
  active: boolean
  bottom: boolean
}

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