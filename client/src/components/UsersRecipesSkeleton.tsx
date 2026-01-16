import React from 'react'
import { Link } from 'react-router'

const UsersRecipesSkeleton = () => {
  return (
     <>
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="w-full h-[402px] bg-white rounded-xl cursor-pointer"
        >
          <Link
          to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <figure className="w-full h-52">
              <img
              
                className="w-full h-full bg-center bg-no-repeat bg-cover rounded-t-xl "
              />
            </figure>
          </Link>

          <div className="px-3 py-2">
            <h2 className="py-2 text-xl text-red-700">----</h2>
            <div className="flex items-center gap-2">
              {[1,2,3,4].slice(0, 2).map((index) => (
                <span
                  className="px-2 py-1 text-sm bg-[#00FF9C] rounded-lg"
                  key={index}
                >
                 ---
                </span>
              ))}
            </div>
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-1">
                
                <p>---</p>
              </div>
              <div className="flex items-center gap-1">
           
                <p>---</p>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <div className="flex justify-end w-full">
                <Link to="/">
                  <div className="flex justify-center py-2 mr-5 bg-green-100 rounded-lg cursor-pointer w-11 hover:bg-green-500">
                  ---
                  </div>
                </Link>
                <div className="flex justify-center py-2 mr-5 bg-red-100 rounded-lg cursor-pointer w-11 hover:bg-red-500">
                 ---
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default UsersRecipesSkeleton
