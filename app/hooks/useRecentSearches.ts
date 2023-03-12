import { BehaviorSubject } from "rxjs"

const stored  = typeof window !== 'undefined' ? localStorage.getItem('__recents__') : null
const recents: string[] = stored ? JSON.parse(stored) : []

export const useRecentSearches$ = new BehaviorSubject<string[]>(recents)