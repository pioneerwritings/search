import { atom } from 'recoil'

interface SearchState {
  active: boolean
  query: string
  results: any[]
}

export const searchState = atom<SearchState>({
  key: 'search',
  default: {
    active: false,
    query: '',
    results: []
  }
})