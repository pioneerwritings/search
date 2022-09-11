
export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full h-32 flex items-center justify-center bg-gray-50 mt-12'>
      <p>
        <strong>© {currentYear}</strong> Pioneer Writings
      </p>
    </footer>
  )
}