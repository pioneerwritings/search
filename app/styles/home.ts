
export const styles = {
  tabs: `
    max-w-xs
    h-8
    px-4
    mx-auto
    mb-6
    flex
    justify-between
  `,
  tab: `
    position:relative
    after:h-0.5
    after:w-0
    aria-selected:after:position:absolute
    aria-selected:after:content-""
    aria-selected:after:bottom-2
    aria-selected:after:h-0.5
    aria-selected:after:w-6
    aria-selected:after:bg-indigo
    aria-selected:font-bold
    transition-all
    after:transition-all
    flex-1
    flex
    flex-col
    justify-center
    items-center
    box-border
    text-indigo
    focus:bg-cornflower
    focus:bg-opacity-5
    focus:outline-dashed
    focus:outline-1
    focus:font-bold
    hover:bg-cornflower/5
    rounded-sm
    text-sm
  `,
  gridContainer: `
    m-auto md:max-w-3xl lg:max-w-3xl xl:max-w-6xl
  `,
  grid: `
    grid
    gap-6
    w-full
    h-full
    grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))]
    justify-items-center
  `
}