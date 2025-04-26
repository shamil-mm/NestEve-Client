import  { useEffect, useState } from 'react'
import AdminCommonLayout from '../../components/common/Admin/AdminCommonLayout'
import CreateTagModal from '../../components/layout/Modal/CreateTagModal';
import { blockList, editTag, fetchSingleTag, getTags, tagCreation } from '../../services/EventServices';

const Tags = () => {
    const [sortField, ] = useState('');
    const[isModalOpen,setIsModalOpen]=useState(false)
    const [name,setName]=useState("")
    const [error,setError]=useState<string|null>(null)
    const [tagList,setTagList]=useState<{_id:string; tag: string;usageCount: number;is_block: boolean;}[]>([])
    const [isEdit , setIsEdit]=useState<string|null>(null)
     useEffect(() => {
          const fetchCategories = async () => {
            try {
              const response = await getTags();
              if(response?.data?.tags){
                setTagList(response?.data?.tags);
              }
            } catch (error) {
              console.error("Error fetching categories:", error);
            }
          };
        
          fetchCategories();
        }, []);






    const toggleModal=()=>{
        setIsModalOpen(!isModalOpen)
        setName("")
        setError(null)
        setIsEdit(null)
    }

    const handleSubmit=async(e:React.MouseEvent)=>{
        e.preventDefault()
        if(name.trim()==="" && name.trim().length<3){
            setError('provide a name atleast 5 letter')
            return
        }
        if(isEdit){
          const response=await editTag(name,isEdit)
                    console.log('response edit',response?.data?.response.tags._id)
                    if( response?.data?.response?.tags){
                      setTagList(prevTagList=>
                        prevTagList.map(tag=>
                          tag._id=== response?.data?.response.tags._id
                          ?response?.data?.response.tags:tag
                        )
                      )
                    } 

        }else{
          const response=await tagCreation(name as string)
          console.log(response?.data?.response.tag)
          if( response?.data?.response?.tag){
            setTagList(prevTagList=>[
              ...prevTagList,
              response?.data?.response.tag
            ])
          } 
          
        }
        toggleModal()
        setName("")
       
    }
    const handleBlock= async(_id:string,is_block:boolean)=>{
      const response=await blockList(_id,is_block)
      if(response?.status===200){
                      setTagList(prevList=>
                        prevList.map((list)=>
                          list._id===_id ? {...list,is_block:!list.is_block}:list
                        )
                      )
                    }
    }

    const handleEdit=async(id:string)=>{
          console.log("handle edit",id)
          const response=await fetchSingleTag(id)
          
          if(response?.data?.response?.tag){
            setName(response?.data?.response?.tag?.tag)
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
          <h2 className="text-xl font-semibold">Tags's List</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2">Sort by</span>
              <select 
                className="border rounded px-2 py-1"
                defaultValue={sortField}
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
              Add New Tag
            </button>
            <CreateTagModal isOpen={isModalOpen}>
                <div>
               
      <h2 className="text-2xl font-semibold text-center mb-6">Create a Tag</h2>
      
      
      {/* {success && <p className="text-green-500 text-center mb-4">Tag created successfully!</p>} */}

      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
            Tag Name
          </label>
          
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tag name"
          />
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </div>
      </form>
    
                </div>
            <div>
            <button onClick={toggleModal}className="float-end bg-red-600 text-white px-2 py-1 mx-1 rounded-sm hover:bg-red-500">Close</button>
            <button onClick={handleSubmit }className="float-end bg-blue-600 text-white px-2 py-1 mx-1 rounded-sm hover:bg-blue-500"> Add</button>
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
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Tag</th>
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Usage count</th>
                {/* <th className="px-6 py-3 text-left text-sm font-medium border-r">Event Created</th>
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Ticket Purchased</th> */}
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tagList?tagList.map((list, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{user._id}</td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{user.email}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm  border-r">{list.tag}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  border-r">{list.usageCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        list.is_block === false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                       {list.is_block==false ? "Unblock":"Block"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                    <button onClick={()=>{handleEdit(list._id)}} className='px-3 py-1 bg-blue-600 rounded text-white'>
                       Edit
                    </button>
                    <button onClick={()=>{handleBlock(list._id,list.is_block)}} className={`${list.is_block===false?'px-3 py-1 bg-yellow-600 rounded text-white':'p-1 bg-red-500 rounded text-white'}`}>
                        {list.is_block===false? " Block ":"UnBlock"}
                    </button>
                      
                    </div>
                  </td>
                </tr>
             )):<>users not fount in database</>} 
            </tbody>
          </table>
        </div>
      </div>
    </div>
       </>
    </AdminCommonLayout>
  )
}

export default Tags
