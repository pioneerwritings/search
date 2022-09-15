export const styles = {
  page: `
    w-full 
    min-h-screen
    pt-16 
    pb-36 
    px-8 
    antialiased
    flex
    flex-col
    items-center
  `,
  h1: `
    leading-tight
    text-center
    font-heldane-bold
    text-3xl
    md:text-[2.5rem]
    antialiased
    mb-4
  `,
  description: `
    text-center text-ash max-w-[400px] mx-auto
  `,
  input: `
    border
    border-gray-500
    mt-6
    w-full
    h-12
    rounded-lg
    px-4
    outline-indigo
  `,
  continueButton: `
    flex
    items-center
    mt-6
    mx-auto
    disabled:opacity-30
    disabled:cursor-not-allowed
  `,
  goHome: `
    flex text-black no-underline mt-6 hover:underline
  `
}