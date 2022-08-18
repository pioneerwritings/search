import { render, screen } from '~/test/test-utils'
import { type DropdownProps, Dropdown } from '.'
import type { DropdownItem } from '~/types'

import userEvent from '@testing-library/user-event'

describe('Dropdown component', () => {

  const list: DropdownItem[] = [
    { id: 0, value: 'Bread' },
    { id: 1, value: 'Fruit' },
    { id: 2, value: 'Salad' }
  ]

  const props: DropdownProps = {
    onChange: jest.fn(),
    list,
    selected: list[1],
    placeholder: 'Select an item!',
    className: 'custom-dropdown',
    ariaLabel: 'Grocery list'
  }

  const renderComponent = (options?: DropdownProps) => {
    return render(<Dropdown {...props} {...options} />)
  }

  it('component should render', () => {
    const { baseElement } = renderComponent()
    expect(baseElement).toBeInTheDocument()
  })

  it('panel should expand on click', () => {
    renderComponent()

    const header = screen.getByText(props.selected.value)
    userEvent.click(header)

    const panel = screen.getByRole('listbox')
    const combo = screen.getByRole('combobox')

    expect(combo.getAttribute('aria-expanded')).toBeTruthy()
    expect(panel).toBeInTheDocument()
  })

  it('panel should close on option select', () => {
    renderComponent()

    const header = screen.getByText(props.selected.value)
    userEvent.click(header)

    const panel = screen.getByRole('listbox')
    const combo = screen.getByRole('combobox')

    expect(combo.getAttribute('aria-expanded')).toBeTruthy()
    expect(panel).toBeInTheDocument()

    const option = screen.getAllByRole('option')[2]
    userEvent.click(option)

    expect(panel).not.toBeInTheDocument()
  })

  it('panel should render correct number of options', () => {
    renderComponent()

    const header = screen.getByText(props.selected.value)
    userEvent.click(header)

    const options = screen.getAllByRole('option')
    expect(options.length).toEqual(props.list.length)
  })

  it('option should be active when selected', () => {
    renderComponent()

    const header = screen.getByText(props.selected.value)
    userEvent.click(header)

    const panel = screen.getByRole('listbox')

    const option = screen.getAllByRole('option')[2]
    userEvent.click(option)
    userEvent.click(header)

    expect(option.getAttribute('aria-selected')).toBeTruthy()
    expect(panel.getAttribute('aria-activedescendant')).toBe(String(props.selected.id))
  })

  it('should match snapshot', () => {
    const { baseElement } = renderComponent()
    expect(baseElement.firstChild).toMatchSnapshot()
  })
})
