
import { useState } from "react"
import Organizersidebar from "../../components/common/SideBar/Organizersidebar"
import PageLayout from "../../components/layout/OrganizerPageLayout/PageLayout"
import OrganizerHome from "../../components/layout/OrganizerPageLayout/OrganizerHome"
import OrganizerEvents from "../../components/layout/OrganizerPageLayout/OrganizerEvents"
import OrganizerFinance from "../../components/layout/OrganizerPageLayout/OrganizerFinance"
import OrganizerOrders from "../../components/layout/OrganizerPageLayout/OrganizerOrders"
import OrganizerDashboard from "../../components/layout/OrganizerPageLayout/OrganizerDashboard"
import OrganizerScanQRcode from "../../components/layout/OrganizerPageLayout/OrganizerScanQRcode"


const ManageEvents = () => {
  const [correntOption,setCorrentOption]=useState<string|null>("DASHBOARD")
  const handlePageCB=(value:string)=>{
    setCorrentOption(value)
  }
 
  return (
   <PageLayout>
    <Organizersidebar handlePageCB={handlePageCB}/>
    <div className="px-5 w-full">

    {correntOption === "HOME" && <OrganizerHome onSuccess={handlePageCB}/> }
    {correntOption === "DASHBOARD" && <OrganizerDashboard /> }
    {correntOption === "EVENTS" && <OrganizerEvents/>}
    {correntOption === "FINANCE" && <OrganizerFinance/>}
    {correntOption === "SCANQRCODE" && <OrganizerScanQRcode/>}
    {correntOption === "ORDERS" && <OrganizerOrders/>}
   
    </div>

   </PageLayout>
  )
}

export default ManageEvents
