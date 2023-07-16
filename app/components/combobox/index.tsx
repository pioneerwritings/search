import { useEffect, useState, useCallback } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

import Classnames from 'classnames'
import { Show } from '../show'

export interface ComboBoxProps {
  list: Array<string>
  handleChange: (topic: string) => void
  activeItem: string
  placeholder?: string
  label?: string
}

export const ComboBox = ({
  list,
  activeItem,
  handleChange,
  placeholder,
  label
}: ComboBoxProps) => {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string>(activeItem)

  const filteredList =
    query === ''
      ? list
      : list.filter((item) => item.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (activeItem) setSelected(activeItem)
  }, [activeItem])

  const handleReset = useCallback(() => {
    setQuery('')
    setSelected('')
    handleChange('')
  }, [])

  return (
    <Combobox
      nullable
      as='div'
      data-testid='target'
      aria-label={label}
      value={selected}
      onChange={(topic) => {
        if (topic !== null) {
          setSelected(topic)
          handleChange(topic)
        }
      }}
      className='max-w-[368px] mx-auto mb-8'>
      <Show when={!!label}>
        <Combobox.Label className='block text-xs font-medium leading-6 text-gray-900 text-center'>
          {label}
        </Combobox.Label>
      </Show>

      <div className='relative mt-2'>
        <Combobox.Input
          className='w-full rounded-md border bg-white py-1.5 pl-4 pr-12 text-gray-900 shadow-sm border-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo/30 sm:text-sm sm:leading-6'
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {}}
          displayValue={(item: string) => item}
          placeholder={placeholder}
        />

        <div className='absolute inset-y-0 right-0 flex items-center'>
          {selected || query ? (
            <Combobox.Button
              className='rounded-r-md focus:outline-none'
              onClick={handleReset}>
              <XMarkIcon
                className='w-4 h-4 text-gray-400 mr-2'
                aria-hidden='true'
              />
            </Combobox.Button>
          ) : null}

          <Combobox.Button className='rounded-r-md focus:outline-none'>
            <ChevronDownIcon
              className='h-5 w-5 mr-3 text-gray-400'
              aria-hidden='true'
            />
          </Combobox.Button>
        </div>

        <Transition
          enter='transition duration-100 ease-out'
          enterFrom='transform scale-95 opacity-0'
          enterTo='transform scale-100 opacity-100'
          leave='transition duration-75 ease-out'
          leaveFrom='transform scale-100 opacity-100'
          leaveTo='transform scale-95 opacity-0'>
          <Combobox.Options
            data-testid='listbox'
            className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
            {filteredList.map((item) => (
              <Combobox.Option
                key={item}
                value={item}
                className={({ active }) => {
                  return Classnames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    'hover:cursor-pointer',
                    active ? 'bg-indigo text-white' : 'text-gray-900'
                  )
                }}>
                {({ active, selected }) => (
                  <>
                    <span
                      className={Classnames(
                        'block truncate',
                        selected && 'font-semibold'
                      )}>
                      {item}
                    </span>

                    {selected && (
                      <span
                        className={Classnames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-cornflower'
                        )}>
                        <CheckIcon className='h-5 w-5' aria-hidden='true' />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}
