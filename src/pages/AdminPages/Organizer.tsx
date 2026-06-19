import { SetStateAction, useEffect, useState } from "react";
import AdminCommonLayout from "../../components/common/Admin/AdminCommonLayout"
import {Search} from "lucide-react";
import { blockUser, fetchOrganizers } from "../../services/authServices";

const Organizers = () => {

  interface IOrganizer {
      name: string;
      email: string;
      _id: string;
      status?:'active' | 'suspended' | 'deleted';
      is_block:boolean
    }
  
    const [users, setUsers]=useState<IOrganizer[]>([])
     const [searchTerm, setSearchTerm] = useState('');
      const [sortField, setSortField] = useState('');
      const [sortDirection, setSortDirection] = useState('asc');
      const [filterBy, setFilterBy] = useState('');
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const [limit] =useState(1)
   
    useEffect(()=>{
      const FetchOrganizers=async()=>{
        try {
          console.log("FetchOrganizer working")
          const res= await fetchOrganizers({search: searchTerm, sortField, sortDirection, filterBy, page, limit})
          console.log('FetchOrganizer',res)
          setUsers(res?.data.organizers.organizers)
          setTotalPages(res?.data.organizers.totalPages);
        } catch (error) {
          console.log('Fetch User error',error)
        }
      }
      FetchOrganizers()
    },[searchTerm, sortField, filterBy, page, limit])
    
     
    
    
      const handleSort = (field: SetStateAction<string>) => {
        if (sortField === field) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field);
          setSortDirection('asc');
        }
      };
    
     
      const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(e.target.value);
      };

      const handleBlock=async(data:{email:string,is_block:boolean})=>{
              const res=await blockUser(data)
              const updateduser=res?.data?.response?.updatedUser
              if(updateduser){
                setUsers(prevUsers=>
                  prevUsers.map(user=>
                    user.email===updateduser.email ?
                    {...user,is_block:updateduser.is_block}
                    :user
                  )
                )
              }

            }
    
      // Filter users based on search term
      let filteredUsers
      if(users){
         filteredUsers= users.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user._id.includes(searchTerm)
        );
      }
     

  


  return (
    <AdminCommonLayout>
       <>
       <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        {/* Header with search, filter and add user button */}
        <div className="flex justify-between items-center p-4 ">
          <h2 className="text-xl font-semibold">Organizers's List</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2">Sort by</span>
              <select 
                className="border rounded px-2 py-1"
                value={sortField}
                onChange={(e) => handleSort(e.target.value)}
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
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-md pl-10 pr-4 py-1 w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Add New User
            </button> */}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto  rounded-md shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold ">User Id</th>
                <th className="px-6 py-3 text-left text-sm font-semibold ">User name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold ">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold ">Event Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold ">Ticket Purchased</th>
                {/* <th className="px-6 py-3 text-left text-sm font-semibold ">Status</th> */}
                <th className="px-6 py-3 text-left text-sm font-semibold ">Actions</th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-100">
              {filteredUsers?filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{user._id.slice(-5)}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">1</td>
                  <td className="px-6 py-4 text-sm text-gray-800">3</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-800 text-center">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                    <button onClick={()=>{handleBlock({email:user.email,is_block:user.is_block})}} className={`${user.is_block===false?'px-3 py-1 bg-yellow-600 rounded text-white':'p-1 bg-red-500 rounded text-white'}`}>
                        {user.is_block===false? " Block ":"UnBlock"}
                    </button>
                    </div>
                  </td>
                </tr>
              )):<>Organizers not fount in database</>}
            </tbody>
          </table>
        </div>
         <div className="flex justify-center p-4 space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-gray-100 rounded">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
      </div>
    </div>
       </>
    </AdminCommonLayout>
  )
}

export default Organizers