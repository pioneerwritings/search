
export const styles = {
  nav: `
    transition-all
    z-30 
    w-80 
    h-full 
    bg-midnight 
    fixed 
    flex 
    flex-col 
    p-6 
    top-0 
    md:hidden 
    after:fixed 
    after:-z-10 
    after:top-0 
    after:left-0 
    after:w-full 
    after:h-full
    after:-left-[500px]
  `,
  close: `
    w-14
    h-14 
    rounded-lg 
    bg-white/10 
    flex 
    items-center 
    justify-center 
    mb-4
  `,
  link: `
    text-white 
    text-2xl 
    py-6
    ml-4
    border-b 
    border-b-white/20 
    last:border-0
    relative
    flex
    items-center
  `,
  activeLink: `
    before:absolute
    before:-left-[16px]
    before:rounded-sm
    before:block
    before:w-[4px]
    before:h-[12px]
    before:bg-cornflower
    before:z-10
    text-cornflower
  `
}