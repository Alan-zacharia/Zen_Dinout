import React from 'react'

const RestuarantNotFound : React.FC = () => {
  return (
      <div className="flex flex-col m-auto ">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696455.jpg?w=826&t=st=1719397546~exp=1719398146~hmac=2d79e2207a4c81feb36f61a2df25e0150ae9f205e0bbc1d86ea05d171e1c7950"
            className="h-56 w-56  "
          ></img>
          <p className="font-bold flex justify-center text-xl">
            No Restuarants found.....
          </p>
    </div>
  )
}

export default RestuarantNotFound
