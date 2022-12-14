export const styles = {
  header: `
    flex items-center justify-between h-20 relative
  `,
  logo: `
    hidden 
    md:block 
    logo 
    absolute 
    left-0 
    ml-10
  `,
  nav: `
    hidden 
    md:flex 
    items-center 
    justify-between 
    mx-auto
  `,
  logomark: `
    md:hidden 
    mx-auto 
    w-[20px]
  `,
  hamburger: `
    md:hidden 
    absolute 
    left-0 
    ml-10
  `,
  search: `
    absolute 
    right-0 
    mr-10
  `,
  activeRoute: `
    !text-black
    transition-all
    after:w-4
    after:rounded-xl
    after:bg-black
    after:h-[0.2rem]
    after:absolute
    after:bottom-6
    flex
    flex-col 
    justify-center 
    items-center
  `
}