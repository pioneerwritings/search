
export const styles = {
  article: `
    w-full
    min-h-screen
    pt-16
    pb-36
    px-8
    antialiased
  `,
  main: `
    flex
    flex-col
    justify-center
    max-w-[600px]
    mx-auto
  `,
  badge: `
    text-center 
    inline-block 
    mb-6 
    text-indigo 
    font-bold 
    bg-cornflower/10 
    mx-auto 
    px-4 
    py-1 
    rounded-full
  `,
  h1: `
    leading-tight
    text-center
    font-heldane-bold
    text-3xl
    md:text-[2.5rem]
    md:leading-[1]
    antialiased
  `,
  author: `
    text-center
    font-light
    mt-6
  `,
  periodical: `
    periodical 
    text-center
    font-light
    mt-1
    md:mt-4
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
    bg-white
    flex 
    items-center 
    justify-between
    px-4 
    h-10 
    cursor-pointer
    transition-all 
    hover:scale-110 
    active:scale-100 
    transform-gpu
    border
    border-gray-300
  `
}