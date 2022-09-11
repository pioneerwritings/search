
export const styles = {
  page: `
    w-full 
    pt-16 
    pb-36 
    px-8 
    antialiased
  `,
  h1: `
    leading-tight
    text-center
    font-heldane-bold
    text-3xl
    md:text-[2.5rem]
    antialiased
  `,
  author: `
    my-4 block text-center
  `,
  description: `
    text-center text-ash max-w-[600px] mx-auto
  `,
  series: `
    text-center block font-bold text-cornflower mb-2
  `,
  gridContainer: `
    mt-12
    m-auto
    md:max-w-3xl
    lg:max-w-3xl
    xl:max-w-6xl
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