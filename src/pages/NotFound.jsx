import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="not-found flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="text-lg text-grey-main">Oops! Page not found.</p>
      <Link
        to="/"
        className="mt-4 px-6 py-3 bg-festival text-black rounded-full"
      >
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound
