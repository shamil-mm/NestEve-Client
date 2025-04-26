import { useEffect, useState } from "react"
import { fetchCategoriesList } from "../../../services/EventServices";
import DatePicker from "react-datepicker"; 
import 'react-datepicker/dist/react-datepicker.css'

interface BrowseEventSidebarProps{getSelectedFilters(dateFilter:string,category:string,customDate?:string|null):void} 

const BrowseEventSidebar:React.FC<BrowseEventSidebarProps> = ({getSelectedFilters}) => {
    const [categoryList,setCategoryList]=useState<{_id: string ;categoryName: string;}[]>([])
    const [filterData,setFilterData]=useState<{dateFilter:string,customDate?:string|null,category:string}>({dateFilter:"",customDate:"",category:""})
    useEffect(()=>{
             const fetchcategories=async()=>{
                        
                    try {
                       const res=await fetchCategoriesList()
                       
                       if(res?.data?.categoris){
                        setCategoryList(res?.data?.categoris)
                       }
            
                    } catch (error) {
                        console.error("Failed to fetchcategories", error); 
                    }
              
              }
              fetchcategories()
          },[])

          useEffect(()=>{
            getSelectedFilters(filterData.dateFilter,filterData.category,filterData.customDate)
          },[filterData])
          const handlerDateFilterChange=(value:"today"|'lastweek'|'custom')=>{
            if(value!=='custom'){
              setFilterData(prev=>({...prev,customDate:"",dateFilter:value}))
            }
            setFilterData(prev=>({...prev,dateFilter:value}))
          }
         
        
         
                      
  return (
    <div className="w-80 h-150 bg-black/50 text-white  border-blue-700 border-2 mx-8">
        <div className="p-4">
          <nav>
          <h1 className=" text-white text-3xl p-2">Filters</h1>
          <h1 className=" text-white  px-4 py-2 text-xl">Categories</h1>
        
            <div className="flex flex-wrap gap-2 px-4">
            <select onChange={(e)=>setFilterData(prev=>({...prev,category:e.target.value}))} className="bg-transparent p-2 rounded-sm text-white border-1 border-white" name="categories">
              <option value="" className="bg-black text-white">select category </option>
          {categoryList.map((category) => (
                  <option className="bg-black text-white" key={category._id} value={category.categoryName}>{category.categoryName}</option>
          ))}
           
          </select>


            {/* {categoryList.map((category) => (
                  <Button key={category._id} variant="outline">{category.categoryName}</Button>
                   ))} */}
            </div>
            <h1 className=" text-white text-xl  px-4 py-2">Date</h1>
            <ul className="space-y-2 px-4 text-white">
                <li className="flex items-center gap-3">
                    <input
                     type="radio"
                     id="filter-today"
                     name='dateFilter'
                     value="today"
                     className="form-radio text-indigo-800 h-4 w-4 accent-indigo-500"
                     checked={filterData.dateFilter==='today'}
                     onChange={()=>handlerDateFilterChange("today")}
                    />
                    <label  className="cursor-pointer" htmlFor="filter-today">Today</label>
                </li>
                <li className="flex items-center gap-3">
                    <input
                     type="radio"
                     name='dateFilter'
                     id="filter-lastweek"
                     value="lastweek"
                     checked={filterData.dateFilter==="lastweek"}
                     onChange={()=>handlerDateFilterChange("lastweek")}
                     className="form-radio text-indigo-500 h-4 w-4 accent-indigo-500"
                    />
                    <label  className="cursor-pointer hover:text-indigo-400" htmlFor="filter-lastweek">Last week</label>
                </li>
                <li className="flex items-center gap-3">
                    <input
                     type="radio"
                     id="filter-custom"
                     name='dateFilter'
                     value='custom'
                     className="form-radio text-indigo-500 h-4 w-4 accent-indigo-500"
                     checked={filterData.dateFilter === "custom"}
                     onChange={() => handlerDateFilterChange("custom")}
                    />
                    <label  className="cursor-pointer hover:text-indigo-400" htmlFor="filter-custom">Pick a date</label>
                </li>
                {filterData?.dateFilter==='custom' && (
                 <DatePicker
                 className="border-1 h-10 placeholder-white rounded-sm border-white"
                 selected={filterData && filterData.customDate as any}
                 onChange={(date: Date|null) => setFilterData(prev=>({
                  ...prev,
                  customDate:date? date.toString() : null}))}
                 placeholderText="   select a date"
                 />
                )}
                
            </ul>

          
          </nav>
        </div>
      </div>
  )
}

export default BrowseEventSidebar
