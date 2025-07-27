import { SetStateAction, useEffect, useState } from "react";
import AdminCommonLayout from "../../components/common/Admin/AdminCommonLayout"
import { IEvent } from "../../interfaces/IEvent";
import { Search } from "lucide-react";
import { blockEvent, fetchEvent } from "../../services/EventServices";


const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterBy, setFilterBy] = useState('');
  const [events, setEvents] = useState<IEvent[]>([])
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const Fetchevents = async () => {
      try {
        const res = await fetchEvent(searchTerm, sortField, sortDirection, filterBy, page, limit)
        if (res?.data.events) {
          setEvents(res?.data.events)
          setTotalPages(res?.data?.totalPages)
        }

      } catch (error) {
        console.log('Fetch events error', error)
      }
    }
    Fetchevents()
  }, [searchTerm, sortField, sortDirection, filterBy, page, limit])

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


  const handleBlock = async (e: React.MouseEvent<HTMLButtonElement>, data: { id: string, is_block: boolean }) => {
    console.log('handleblock is working')
    e.preventDefault()
    const res = await blockEvent(data)
    if (res?.data?.response?.message === "success") {
      setEvents(prevList =>
        prevList.map(event =>
          event._id === data.id
            ? { ...event, is_block: !event.is_block }
            : event
        )
      )
    }

  }




  let filteredEvents
  if (Array.isArray(events)) {
    filteredEvents = (events as IEvent[]).filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event._id.includes(searchTerm)
    );


    return (
      <AdminCommonLayout>
        <>

          <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow">


              <div className="flex justify-between items-center p-4 ">
                <h2 className="text-xl font-semibold">Events List</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="mr-2">Sort by</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={sortField}
                      onChange={(e) => handleSort(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="title">Title</option>
                      <option value="description">Description</option>
                      <option value="startTime">Time</option>
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
                      <option value="showing">Showing</option>
                      <option value="hidden">Hidden</option>
                      <option value="draft">Draft</option>
                     
                    </select>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="border rounded-sm pl-10 pr-4 py-1 w-64"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                
                </div>
              </div>

              <div className="overflow-x-auto rounded-md shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium ">No</th>
                      <th className="px-6 py-3 text-left text-sm font-medium ">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-medium ">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-medium ">Start Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium ">Start Time</th>
                      <th className="px-6 py-3 text-left text-sm font-medium ">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className=" divide-y divide-gray-200">
                    {filteredEvents ? filteredEvents.map((event, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm ">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm ">{event.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate relative group">
                          <span className="truncate " title={event.description}>
                            {event.description}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center ">{new Date(event.startDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center ">{event.startTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${event.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">

                            <button onClick={(e) => { handleBlock(e, { id: event._id, is_block: event.is_block }) }} className={`${event.is_block === false ? 'px-3 py-1 bg-yellow-600 rounded text-white' : 'p-1 bg-red-500 rounded text-white'}`}>
                              {event.is_block === false ? " Block " : "UnBlock"}
                            </button>

                          </div>
                        </td>
                      </tr>
                    )) : <>events not fount in database</>}
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
}

export default Events
