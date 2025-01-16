import React from 'react'
import SearchBox from './SearchBox'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <div className='flex justify-between px-20 py-4 bg-white'>
      <div className='flex items-center'>
        <figure>
          <Link to="/">-
            Logo
          </Link>
        </figure>
      </div>
      {/* <div>
        <SearchBox />
      </div> */}
      <div className='flex items-center space-x-3 font-semibold text-md'>
        <span>Home</span>
        <span>Favorites</span>
        <span>Profile</span>
        <Link to="/create-recipe">Create Recipe</Link>
        <Link to="/add-categories">Category selection</Link>
        <Link to="/ingredients-and-instructions">Instructions and Ingredients</Link>
      </div>
      <div className='space-x-4'>
        <button className='px-4 py-2 border border-blue-600 rounded-full text-md'>
          Sign Up
        </button>
        <button className='px-4 py-2 text-white bg-blue-600 rounded-full text-md'>
          Login
        </button>
      </div>
    </div>
  )
}

export default Navbar
