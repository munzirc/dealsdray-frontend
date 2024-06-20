import React from 'react'
import HomeNavBar from '../components/HomeNavBar'

const Home = () => {
  return (
    <>
     <HomeNavBar currPage={'home'}/>
     <div className='flex py-32 items-center justify-center'>
        <span className='text-5xl font-bold text-zinc-600'>Welcome to Admin Panel</span>
     </div>
    </>
  )
}

export default Home