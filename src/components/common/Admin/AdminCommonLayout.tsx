import Sidebar from "../../layout/AdminDashborad/Sidebar"
import Header from "../../layout/AdminDashborad/Header"
import React from "react"


const AdminCommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminCommonLayout
