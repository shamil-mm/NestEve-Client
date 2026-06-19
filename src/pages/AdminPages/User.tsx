import { SetStateAction, useEffect, useState } from "react";
import AdminCommonLayout from "../../components/common/Admin/AdminCommonLayout"
import { Search } from "lucide-react";
import { blockUser, fetchUsers } from "../../services/authServices";

const User = () => {
  interface Users {
    name: string;
    email: string;
    _id: string;
    status?: 'active' | 'suspended' | 'deleted';
    createdAt:string;
    is_block: boolean
  }
  const [users, setUsers] = useState<Users[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterBy, setFilterBy] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const FetchUsers = async () => {
      try {
        const res = await fetchUsers(searchTerm, sortField, sortDirection, filterBy, page, limit)
        setUsers(res?.data.users?.users)
        setTotalPages(res?.data?.users?.totalPages || 1);
        
      } catch (error) {
        console.log('Fetch User error', error)
      }
    }
    FetchUsers()
  }, [searchTerm, sortField, filterBy, page, limit])
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
    setPage(1)
  };



  const handleBlock = async (data: { email: string, is_block: boolean }) => {
    try {
      const res = await blockUser(data)
      const updatedUser = res?.data?.response?.updatedUser
      setUsers(prevUser =>
        prevUser.map(user =>
          user.email === updatedUser.email ? { ...user, is_block: updatedUser.is_block } : user
        )
      )

    } catch (error) {
      console.error("Error blocking user:", error);
    }

  }





  return (
    <AdminCommonLayout>
      <>

        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow">
            <div className="flex justify-between items-center p-4">
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
                  </select>
                </div>
                {/* <div className="flex items-center">
                  <span className="mr-2">Sort Order</span>
                  <select id="sortDirection"
                   className="border rounded px-2 py-1"
                    value={sortDirection}
                    onChange={(e) =>{
                      e.preventDefault()
                      handleSort(e.target.value)}}
                  >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                </div> */}
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

              </div>
            </div>


            <div className="overflow-x-auto  rounded-md shadow-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">No</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">User Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    
                    <th className="px-6 py-3 text-center text-sm font-semibold">Join Date</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users && users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-all">
                        <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-800">{user.createdAt.split("T")[0]}</td>
                        {/* <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {user.status}
                          </span>
                        </td> */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              handleBlock({ email: user.email, is_block: user.is_block })
                            }
                            className={`text-xs px-4 py-1 rounded-md font-medium shadow-sm transition-all ${user.is_block === false
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                          >
                            {user.is_block === false ? 'Block' : 'Unblock'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Users not found in database
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination */}
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

export default User