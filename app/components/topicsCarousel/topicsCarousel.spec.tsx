import { render } from "~/test/test-utils";
import userEvent from '@testing-library/user-event'
import { type TopicsCarouselProps, TopicsCarousel } from './'

const props: TopicsCarouselProps = {
  data: ['Exercise', 'Nutrition', 'Water', 'Sunshine', 'Rest', 'Temperance', 'Trust In God', 'Fresh Air'],
  onClick: jest.fn(),
  activeItem: 'Exercise'
}

const renderComponent = (args?: TopicsCarouselProps) => {
  
  const { container, ...rest } = render(
    <TopicsCarousel {...args} {...props} />
  )
  
  return {
    container,
    topics: rest.getByRole('list'),
    ...rest
  }
}

describe('Topic Carousel', () => {
  it('Should render', () => {
    const { topics } = renderComponent()
    expect(topics).toBeInTheDocument()
  })

  it('Click handler should fire', async () => {
    const { getByRole } = renderComponent()
    const selected = getByRole('listitem', { name: 'Water' })

    await userEvent.click(selected)
    expect(props.onClick).toHaveBeenCalledWith('Water')
  })

  it('Matches the snapshot', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })
})