export const styles = {
  card: `
    transition-all
    rounded-lg
    border
    max-w-[368px]
    w-full
    h-full
    px-4
    pt-4
    pb-6
    cursor-pointer
    text-left
    bg-white
    lg:hover:shadow-lg
    lg:hover:shadow-cornflower/40
    lg:hover:border-indigo/70
    lg:hover:scale-105
    lg:active:scale-100
    lg:focus:shadow-lg
    lg:focus:shadow-cornflower/40
    lg:focus:outline-indigo/70
    lg:focus:outline-2
    lg:focus:scale-105
  `,
  header: `
    flex
    justify-start
  `,
  author: `
    text-ash
    mb-1
  `,
  series: `
    text-indigo
    font-bold
    mb-1
    ml-4
    px-2
    pb-[2px]
    rounded-full
    bg-cornflower/10
  `,
  h2: `
    leading-tight
    font-heldane-bold
    text-xl
    mt-2
    md:w-80
    antialiased
  `,
  p: `
    mt-2
    mb-3
    font-inter
    font-light
    leading-tight
    antialiased
  `,
  topic: `
    border
    rounded-full
    px-2
    py-1
    font-inter
    text-[10px]
    border-cornflower/50
    mr-2
    shrink-0
    hover:border-cornflower
    hover:transition-all
    hover:bg-cornflower/5
  `
}
