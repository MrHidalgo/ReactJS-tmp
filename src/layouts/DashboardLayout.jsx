import {useEffect, useState} from 'react'

import {Outlet} from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const DashboardLayout = () => {
  return (
    <>
      <Header />
      <Sidebar />

      <main id="main" className="main">
        <div className="main__container">
          <Outlet /> {/* Dynamic Dashboards Pages */}
        </div>
      </main>
    </>
  )
}

export default DashboardLayout
