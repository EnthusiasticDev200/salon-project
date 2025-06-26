const Loader = () => {
  return (
    <div className='absolute w-full h-full top-0 left-0 bg-white/80 flex justify-center items-center z-50'>
      <div className="w-[50px] h-[50px] text-accent">
        <i className='ri-loader-4-line w-full h-full animate-spin'></i>
      </div>
    </div>
  )
}

export default Loader