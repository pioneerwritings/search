import { type MouseEvent, type KeyboardEvent, useState } from 'react'
import { DropdownItem } from '~/types'

export interface DropdownProps {
  list: DropdownItem[]
  placeholder?: string
  selected?: DropdownItem
  onChange(item: DropdownItem): void
  className?: string
  ariaLabel?: string
}

export const Dropdown = ({ list, placeholder, onChange, className, selected, ariaLabel }: DropdownProps) => {
  const [ expanded, setExpanded ] = useState(false)

  const handleToogle = () => setExpanded(!expanded)

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = event
    const value = currentTarget.textContent!
    const id = Number(currentTarget.id)

    onChange({ id, value })
    handleToogle()
  }

  const handleDropdownKeypress = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key, currentTarget } = event

    if(key === 'Escape' && expanded){
      handleToogle()
    }

    // expand dropdown when the arrow up/down keys are pressed
    if(key === 'ArrowDown' || key === 'ArrowUp') {

      // prevent browser from scrolling the window
      event.preventDefault()

      if(
        (key === 'ArrowDown' && !expanded) ||
        (key === 'ArrowUp'   && !expanded)) {

          handleToogle()

          setTimeout(() => {
            const panel = currentTarget.children[1]
            const nodes = panel.children

            if(key === 'ArrowDown'){
              // if down key pressed, focus first node
              (nodes[0] as HTMLDivElement).focus()
            }
            if(key === 'ArrowUp'){
              // if up key was pressed, focus last node
              (nodes[nodes.length - 1] as HTMLDivElement).focus()
            }
          }, 1)
      }
    }

    // expand dropdown when enter or space is pressed
    if((key === 'Enter' && !expanded) || (key === ' ' && !expanded)) {
      event.preventDefault()
      handleToogle()

      setTimeout(() => {
        const panel = currentTarget.children[1]
        const nodes = panel.children
        
        // focus the first node by default
        if(key === 'Enter' || key === ' '){
          (nodes[0] as HTMLDivElement).focus()
        }
      }, 1)
    }
  }
  
  const handleOptionKeypress = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key, currentTarget } = event
    const value = currentTarget.textContent!
    const id = Number(currentTarget.id)

    if(key === 'ArrowDown'){
      event.preventDefault()

      const nextElement = currentTarget.nextElementSibling as HTMLDivElement
      nextElement?.focus()
    }

    if(key === 'ArrowUp'){
      event.preventDefault()

      const previousElement = currentTarget.previousElementSibling as HTMLDivElement
      previousElement?.focus()
    }

    if(key === 'Enter' || key === ' '){
      onChange({ id, value })
      event.preventDefault()
      handleToogle()
    }
  }

  return (
    <div
      className={[className, 'bg-white relative'].join(' ')}
      role='combobox'
      aria-controls='panel'
      aria-label={ariaLabel ?? ''}
      aria-expanded={expanded ? 'true': 'false' }
      onKeyDown={handleDropdownKeypress}
      tabIndex={0}>

      <div className='flex justify-center items-center px-5 py-0 h-11 cursor-pointer border rounded-md w-full' onClick={handleToogle} tabIndex={-1}>
        <p className='mr-3'>{selected?.value || placeholder || 'Select'}</p>
        <img
          src='/images/carrot.svg'
          alt=''
          aria-hidden='true'
          className={`rotate-${expanded ? '180' : '0'} transition-transform`}
        />
      </div>

      {
        expanded &&
        <div
          className='absolute bg-white py-0 rounded-lg shadow-lg w-full mt-2 border max-h-80 overflow-auto shadow-cornflower/40'
          role='listbox'
          id='panel'
          tabIndex={-1}
          aria-activedescendant={selected?.id.toString()}>
          {
            list?.map(({ id, value }) => {
              const isActive = (value === selected?.value)

              return (
                <div
                  className='h-12 border-b-ash/40 px-6 flex cursor-pointer items-center justify-between aria-selected:bg-cornflower/5 border-b border-b-gray-200 hover:bg-ash/5 focus:outline-dashed focus:outline-cornflower focus:bg-cornflower/20'
                  role='option'
                  aria-label={value}
                  aria-selected={isActive ? 'true': 'false'}
                  key={id}
                  id={String(id)}
                  onClick={handleClick}
                  onKeyDown={handleOptionKeypress}
                  tabIndex={0}>
                  
                  <p className={isActive ? 'font-bold text-indigo' : ''} id={String(id)}>{value}</p>

                  {
                    isActive &&
                    <img
                      src='/images/option-selected.svg'
                      aria-hidden='true'
                    />
                  }
                </div>
              )
            })
          }
        </div>
      }
    </div>
  )
}