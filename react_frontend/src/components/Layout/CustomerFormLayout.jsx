const CustomerFormLayout = ({ children, bg_image }) => {
  return (
    <div className='h-screen relative flex'>
      <img src={bg_image} className='w-full h-full object-cover absolute z-0' alt="" />
      <div className='h-auto my-auto py-8 rounded-xl px-8 w-[90%] mx-auto backdrop-blur-3xl relative flex flex-col justify-center md:my-0 md:mx-0 md:ml-auto md:px-20 md:h-full md:basis-1/2 md:rounded-none overflow-auto'>
        { children }
      </div>
    </div>
  )
}

export default CustomerFormLayout