import Sidebar from "../../layout/AdminDashborad/Sidebar"
import Header from "../../layout/AdminDashborad/Header"
import React from "react"


const AdminCommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminCommonLayout
