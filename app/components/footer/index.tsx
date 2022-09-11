
export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full h-32 flex items-center justify-start md:justify-center bg-gray-50 mt-12 pl-10 md:p-0'>
      <p><strong>© {currentYear}</strong> Pioneer Writings.</p>
    </footer>
  )
}