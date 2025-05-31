const Pagination = ({ currentPage, setCurrentPage, jumpPage, setJumpPage, totalPages, prev, next, prevDisable, nextDisable, rowsPerPage, setRowsPerPage }) => {
  // Handle Jump to Page
  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setJumpPage("");
    }
  };

  // Handle Page Size Change
  const handlePageSizeChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return (
    <div className='mt-4 flex md:flex-row flex-col items-center gap-6 w-fit mx-auto'>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="p-3 border rounded-xl w-32 text-center focus:border focus:outline-accent bg-[#333]"
          placeholder="Page"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          min="1"
          max={totalPages}
        />
        <button className={'py-3 transition-all'} onClick={handleJumpToPage}>
          Go
        </button>
      </div>

      <ul className='flex gap-3 p-3 bg-[#333] rounded-xl w-fit justify-between items-center mx-auto'>
        <li 
          className={`p-2 bg-mutedTeal rounded-xl text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
          onClick={prev} 
          disabled={prevDisable}
        >
          <i className="ri-arrow-left-s-line"></i>
        </li>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <li 
          className={`p-2 bg-mutedTeal rounded-xl text-white cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
          onClick={next} 
          disabled={nextDisable}
        >
          <i className="ri-arrow-right-s-line"></i>
        </li>
      </ul>

      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select 
          className="p-3 rounded-xl focus:border focus:outline-accent bg-[#333]"
          value={rowsPerPage}
          onChange={handlePageSizeChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  )
}

export default Pagination