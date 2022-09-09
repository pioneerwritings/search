
export const styles = {
  article: `
    w-full
    pt-16
    pb-36
    px-8
    antialiased
  `,
  main: `
    max-w-[600px]
    mx-auto
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
    text-center
    font-light
    mt-6
  `,
  periodical: `
    text-center
    font-light
    mt-1
    md:text-xl
  `,
  subtitle: `
    text-center
    block
    mt-2
  `,
  p: `
    font-inter
    first:mt-2
    font-light
    leading-relaxed
    mt-4
    text-xl
    antialiased
  `,
  seriesPagerButtons: `
    flex
    flex-col
    md:flex-row
    items-center
    justify-between 
    my-6
  `,
  seriesPagerButton: `
    first:mb-4
    md:first:mb-0
    md:first:mr-4
    w-full
    flex
    items-center
    justify-center
    font-semibold
    rounded-lg
    p-4
    disabled:opacity-30
    disabled:cursor-not-allowed
    hover:border-black
    border
    transition-all
  `,
  studyPrayShareContainer: `
    w-full 
    h-40 
    md:h-24 
    rounded-xl 
    px-4 
    md:px-8 
    mt-8 
    flex 
    flex-col 
    md:justify-between 
    md:flex-row 
    justify-center 
    items-center 
    border 
    border-gray-300 
    bg-gray-50
  `,
  studyPrayShareH2: `
    font-heldane font-bold text-[1.75rem] mb-4 md:m-0
  `,
  studyPrayShareButtons: `
    flex mb-2 md:m-0
  `,
  studyPrayShareButton: `
    rounded-full 
    bg-black 
    flex 
    items-center 
    justify-center 
    w-10 
    h-10 
    cursor-pointer 
    hover:shadow-lg 
    hover:shadow-indigo 
    transition-all 
    hover:scale-110 
    active:scale-100 
    transform-gpu
  `
}