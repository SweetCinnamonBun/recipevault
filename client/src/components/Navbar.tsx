import React from 'react'
import SearchBox from './SearchBox'

const Navbar = () => {
  return (
    <div>
      <div>
        <figure>
            Logo
        </figure>
      </div>
      <div>
        <SearchBox />
      </div>
      <ul>
        <li>Login</li>
        <li>Sign Up</li>
      </ul>
    </div>
  )
}

export default Navbar
