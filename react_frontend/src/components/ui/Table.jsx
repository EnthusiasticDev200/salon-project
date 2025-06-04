import React, { useState } from 'react'
import Pagination from './Pagination'
import Button from './Button'

const Table = ({ data, excludedHeaders = [], button = false }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [jumpPage, setJumpPage] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)

  if(!data || data.length === 0) {
    return <p className='text-center font-bold text-xl'>No data available</p>
  }

  const headers = Object.keys(data[0]).filter(header => !excludedHeaders.includes(header))

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const visibleData = data.slice(startIndex, endIndex)

  const prevDisable = currentPage === 1
  const nextDisable = currentPage === totalPages

  return (
    <>
      <div className='my-4 overflow-x-auto py-4 px-4 md:px-8 bg-[#333] rounded-xl'>
        <table className="min-w-full">
          <thead className="border-b-2 border-b-[#555]">
            <tr>
              {
                headers.map((header, index) => <th className='p-2 text-left capitalize' key={index}>{ header }</th>)
              }
              {
                button && <th className='p-2 text-left capitalize'>Update Status</th>
              }
            </tr>
          </thead>
          <tbody>
            {
              visibleData.map((row, index) => 
                <tr className='hover:bg-[#555] border-b-2 border-b-[#555] w-full transition-all' key={index}>
                  {
                    headers.map(header => (
                      <td className='p-2' key={header}>{row[header]}</td>
                    ))
                  }
                  {
                    button && <Button className={'my-1'}>Update</Button>
                  }
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-6 w-fit mx-auto">
        <Pagination 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          jumpPage={jumpPage}
          setJumpPage={setJumpPage}
          totalPages={totalPages} 
          prevDisable={prevDisable}
          nextDisable={nextDisable}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          prev={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          next={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}  
        />
      </div>
    </>
    
  )
}

export default Table