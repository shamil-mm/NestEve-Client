import React, { useEffect, useState } from 'react'
import AdminCommonLayout from '../../components/common/Admin/AdminCommonLayout';
import CreateTagModal from '../../components/layout/Modal/CreateTagModal';
import { blockCategory, categoryCreation, editCategory, fetchSingleCategory, getcategories } from '../../services/EventServices';


const Category = () => {
    const [sortField, setSortField] = useState('');
    const[isModalOpen,setIsModalOpen]=useState(false)
    const [categoryname,setCategoryname]=useState("")
    const [description,setDescription]=useState("")
    const [error,setError]=useState<string|null>(null)
    const [discriptionError,setDiscriptionError]=useState<string|null>(null)
    const [categorylist,setCategoryList]=useState<{_id:string; categoryName: string;description: string;is_block: boolean;}[]>([])
    const [isEdit , setIsEdit]=useState<string|null>(null)
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await getcategories();
          setCategoryList(response?.data?.response?.categoris);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
    
      fetchCategories();
    }, []);
    
    const toggleModal=()=>{
        setIsModalOpen(!isModalOpen)
        setCategoryname("")
        setDescription("")
        setIsEdit(null)

        setError(null)
        setDiscriptionError(null)
    }

    const handleSubmit=async(e:React.MouseEvent)=>{
        e.preventDefault()
        setError(null)
        setDiscriptionError(null)
        if(categoryname.trim()==="" && categoryname.trim().length<3){
            setError('provide a name atleast 3 letter')
            return
        }else if(description.trim()==="" && description.trim().length<10){
            
            setDiscriptionError('provide a name atleast 10 letter')
            return
        }
        console.log(categoryname,description)
        if(isEdit){
          const response=await editCategory(categoryname,description,isEdit)
          console.log('response edit',response?.data?.response.category._id)
          if( response?.data?.response.category){
            setCategoryList(prevCategoryList=>
              prevCategoryList.map(category=>
                category._id=== response?.data?.response.category._id
                ?response?.data?.response.category:category
              )
            )
          } 
        }else{
          const response=await categoryCreation(categoryname,description)

        if( response?.data?.response.category){
          setCategoryList(prevCategoryList=>[
            ...prevCategoryList,
            response?.data?.response.category
          ])
        } 

        }
        

        toggleModal()
        setCategoryname("")
        setDescription("")
        
    }


    const handleBlock=async(data:{id:string,is_block:boolean})=>{
      console.log(data)
            const response=await blockCategory(data)
            if(response?.status===200){
              setCategoryList(prevList=>
                prevList.map((category)=>
                  category._id === data.id ? {...category,is_block:!category.is_block}:category
                )
              )
            }
     }

     const handleEdit=async(id:string)=>{
      console.log("handle edit",id)
      const response=await fetchSingleCategory(id)
      if(response?.data?.response?.category){
        setCategoryname(response?.data?.response?.category?.categoryName)
        setDescription(response?.data?.response?.category?.description)
      }
      setIsEdit(id)
      setIsModalOpen(true)

     }
  return (
    <AdminCommonLayout>
       <>
    
       <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
       

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Categories List</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2">Sort by</span>
              <select 
                className="border rounded px-2 py-1"
                value={sortField}
                // onChange={(e) => handleSort(e.target.value)}
              >
                <option value="">Select</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="mr-2">Filter by</span>
              <select 
                className="border rounded px-2 py-1"
                // value={filterBy}
                // onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-full pl-10 pr-4 py-1 w-64"
                // value={searchTerm}
                // onChange={handleSearch}
              />
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} /> */}
            </div>
            <button onClick={toggleModal} className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Add New Category
            </button>
            <CreateTagModal isOpen={isModalOpen}>
            <div>
    <h2 className="text-2xl font-semibold text-center mb-6">{isEdit?"Edit Category":"Create new Category"}</h2>

    <form>
      {/* Tag Name Field */}
     

      {/* Category Name Field */}
      <div className="mb-4">
        <label htmlFor="categoryName" className="block text-lg font-medium text-gray-700 mb-2">
          Category Name
        </label>
        <input
          type="text"
          id="categoryName"
          value={categoryname}
          onChange={(e) => setCategoryname(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter category name"
          
        />
         {error && <p className="text-red-500  mb-4">{error}</p>}
      </div>

      {/* Description Field */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
        />
        {discriptionError && <p className="text-red-500 mb-4">{discriptionError}</p>}
      </div>
     
      

    </form>
  </div>

  <div>
    <button
      onClick={toggleModal}
      className="float-end bg-red-600 text-white px-2 py-1 mx-1 rounded-sm hover:bg-red-500"
    >
      Close
    </button>
    <button
      onClick={handleSubmit}
      className="float-end bg-blue-600 text-white px-2 py-1 mx-1 rounded-sm hover:bg-blue-500"
    >
      Add
    </button>
  </div>
            </CreateTagModal>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                {/* <th className="px-6 py-3 text-left text-sm font-medium border-r">User Id</th> */}
                <th className="px-6 py-3 text-left text-sm font-medium border-r">categor Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium border-r">description</th>
                {/* <th className="px-6 py-3 text-left text-sm font-medium border-r">Event Created</th>
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Ticket Purchased</th> */}
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categorylist?categorylist.map((category, index) => (
              <tr key={index} className="hover:bg-gray-50"> 
                 <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{category.categoryName}</td> 
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{category.description}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{category.is_block}</td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-r">10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-r">20</td> */}
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        category.is_block === false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.is_block==false ? "Unblock":"block"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">

                    <button onClick={()=>{handleEdit(category._id)}} className='px-3 py-1 bg-blue-600 rounded text-white'>
                       Edit
                    </button>
                    <button onClick={()=>{handleBlock({id:category._id,is_block:category.is_block})}} className={`${category.is_block===false?'px-3 py-1 bg-yellow-600 rounded text-white':'p-1 bg-red-500 rounded text-white'}`}>
                        {category.is_block===false? " Block ":"UnBlock"}
                    </button>
                      
                    </div>
                  </td>
              </tr> 
              )):<>category not fount in database</>} 
            </tbody>
          </table>
        </div>
      </div>
    </div>
       </>
    </AdminCommonLayout>
  )
}

export default Category
