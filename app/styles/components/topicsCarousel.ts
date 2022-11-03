
export const styles = {
  carousel: `
    flex 
    items-center
    mx-auto 
    md:max-w-3xl 
    lg:max-w-3xl 
    xl:max-w-6xl
    mb-6
    md:mb-8
  `,
  topic: `
    bg-gray-50
    h-10
    flex
    justify-center
    items-center
    pb-[2px]
    px-4
    text-md 
    cursor-pointer 
    rounded-full 
    text-center 
    font-bold 
    shrink-0
    mr-4
    hover:bg-gray-100
    focus:bg-gray-100
    focus:outline-black
    border
    hover:border-black
    transition-all
    list-none
  `,
  topics: `
    flex
    items-center
    overflow-x-auto 
    h-16 
    scrollbar-thin
    padding-0
    scroll-smooth
  `,
  inactiveState: `
    text-black
  `,
  activeState: `
    !bg-black
    text-white
    border-black
  `
}