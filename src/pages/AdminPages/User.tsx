import { SetStateAction, useEffect, useState } from "react";
import AdminCommonLayout from "../../components/common/Admin/AdminCommonLayout"
import { Search } from "lucide-react";
import { blockUser, fetchUsers } from "../../services/authServices";

const User = () => {
  interface Users {
    name: string;
    email: string;
    _id: string;
    status?:'active' | 'suspended' | 'deleted';
    is_block:boolean
  }

  const [users, setUsers]=useState<Users[]>([])
  const [data,setData]=useState<Users|object>({})
  useEffect(()=>{
    const FetchUsers=async()=>{
      try {
        console.log("FetchUsers working")
        const res= await fetchUsers()
        setUsers(res?.data.users)
        

      } catch (error) {
        console.log('Fetch User error',error)
      }
    }
    FetchUsers()
  },[data])
   
   
    
      const [searchTerm, setSearchTerm] = useState('');
      const [sortField, setSortField] = useState('');
      const [sortDirection, setSortDirection] = useState('asc');
      const [filterBy, setFilterBy] = useState('');
    
      // Handle sorting
      const handleSort = (field: SetStateAction<string>) => {
        if (sortField === field) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field);
          setSortDirection('asc');
        }
      };
    
      // Handle search
      const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(e.target.value);
      };
      // Handle block

      const handleBlock=async(data:{email:string,is_block:boolean})=>{
        const res=await blockUser(data)
        setData(res?.data?.response?.updatedUser)
      }
    
      // Filter users based on search term
      

     let filteredUsers 
        if(users){ 
          filteredUsers = users.filter(user=> 
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
       

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">User's List</h2>
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
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-full pl-10 pr-4 py-1 w-64"
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                {/* <th className="px-6 py-3 text-left text-sm font-medium border-r">User Id</th> */}
                <th className="px-6 py-3 text-left text-sm font-medium border-r">User name</th>
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Event Created</th>
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Ticket Purchased</th>
                <th className="px-6 py-3 text-left text-sm font-medium border-r">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers?filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{user._id}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-r">10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-r">20</td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">

                    <button onClick={()=>{handleBlock({email:user.email,is_block:user.is_block})}} className={`${user.is_block===false?'px-3 py-1 bg-yellow-600 rounded text-white':'p-1 bg-red-500 rounded text-white'}`}>
                        {user.is_block===false? " Block ":"UnBlock"}
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

export default User