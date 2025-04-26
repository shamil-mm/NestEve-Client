
import { useState } from "react"
import Organizersidebar from "../../components/common/SideBar/Organizersidebar"
import PageLayout from "../../components/layout/OrganizerPageLayout/PageLayout"
import OrganizerHome from "../../components/layout/OrganizerPageLayout/OrganizerHome"
import OrganizerEvents from "../../components/layout/OrganizerPageLayout/OrganizerEvents"
import OrganizerFinance from "../../components/layout/OrganizerPageLayout/OrganizerFinance"
import OrganizerOrders from "../../components/layout/OrganizerPageLayout/OrganizerOrders"


const ManageEvents = () => {
  const [correntOption,setCorrentOption]=useState<string|null>("HOME")
  const handlePageCB=(value:string)=>{
    setCorrentOption(value)
  }
 
  return (
   <PageLayout>
    <Organizersidebar handlePageCB={handlePageCB}/>
    <div className="px-5 w-full">

    {correntOption === "HOME" && <OrganizerHome onSuccess={handlePageCB}/> }
    {correntOption === "EVENTS" && <OrganizerEvents/>}
    {correntOption === "FINANCE" && <OrganizerFinance/>}
    {correntOption === "ORDERS" && <OrganizerOrders/>}
   
    </div>

   </PageLayout>
  )
}

export default ManageEvents
