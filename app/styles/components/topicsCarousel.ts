
export const styles = {
  carousel: `
    mx-auto 
    md:max-w-3xl 
    lg:max-w-3xl 
    xl:max-w-6xl
  `,
  title: `
    text-center 
    block 
    text-lg 
    md:text-2xl
  `,
  topic: `
    bg-gray-100
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
    hover:bg-gray-200
    border
    hover:border-gray-300
    transition-all
  `,
  container: `
    flex 
    items-center 
    h-16 
    mb-6 
    mt-2 
    md:mb-12 
    md:mt-4
  `,
  topics: `
    flex 
    items-center 
    overflow-x-auto 
    h-16 
    scrollbar-thin
  `,
  inactiveState: `
    text-black
  `,
  activeState: `
    !bg-black
    text-white
  `
}