
import PageLayout from "../../components/layout/OrganizerPageLayout/PageLayout"
import BrowseEventSidebar from "../../components/common/SideBar/BrowseEventSidebar"
import SearchBar from "../../components/ui/SearchBar/SearchBar"
import { useCallback, useEffect, useRef, useState } from "react"
import { IEvent } from "../../interfaces/IEvent"
import { fetchSearchEvents } from "../../services/EventServices"
import { useAppSelector } from "../../hooks/AuthHook"
import UserEventCardUI from "../../components/ui/UserEventCardUI/UserEventCardUI"
import UserEventDetail from "../../components/ui/UserEventCardUI/UserEventDetail"
import CheckoutModal from "../../components/layout/Modal/CheckoutModal"
import { checkUserLocation } from "../../services/authServices"
import { searchLocation } from "../../utils/geocode"
import Button from "../../components/ui/LandingPage/Button/Button"




const BrowseEvent = () => {
  const id = useAppSelector((state) => state.authUser?.user?.id)
  const [events, setEvents] = useState<IEvent[]>([])
  const [checkoutModal, setCheckoutModal] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState(4);
  const [place, setPlace] = useState<string>("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const isManualSelection = useRef(false)
  const queryFromServer = useRef(false)



  const [filters, setFilters] = useState({
    search: "",
    location: { lat: 0, lng: 0 },
    sort: "",
    category: "",
    page: '1',
    limit: '3',
    date: {
      dateFilter: "",
      customDate: ""
    },
  })
  useEffect(() => {
    const fetchSuggestions = async () => {
      const res = await searchLocation(place)

      setSuggestions(res)
    }
    if (queryFromServer.current) {
      queryFromServer.current = false;
      return;
    }

    if (isManualSelection.current) {
      isManualSelection.current = false
      return
    }
    const delayDebouce = setTimeout(fetchSuggestions, 600);
    return () => clearTimeout(delayDebouce)
  }, [place])

  useEffect(() => {
    const ensureLocation = async () => {
      if (filters.location.lat <= 0 || filters.location.lng <= 0) {
        console.log('endsure location is wokring')
        try {
          const dbLocation = await checkUserLocation(id as string)
          if (dbLocation.lat > 0 && dbLocation.lng > 0) {
            setFilters(prev => ({
              ...prev,
              location: { lat: dbLocation.lat, lng: dbLocation.lng }
            }));
            return;

          }
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setFilters(prev => ({
                  ...prev,
                  location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  }
                }));
              },
              (error) => {
                console.error("Browser location error", error);
              }
            );

          }
        } catch (error) {
          console.error("Failed to get user location", error);
        }
      }
    }
    if (id) ensureLocation()

  }, [id, place])

  useEffect(() => {

    const FetchEvents = async () => {
      try {
        const response = await fetchSearchEvents(filters);
        if (response?.data?.events?.events) {
          setEvents(response.data.events.events);
          setTotalPages(response.data.events.totalPages);
        }

      } catch (error) {
        console.error("fetch events error", error);
      }
    }

    if (filters.location.lat > 0 && filters.location.lng > 0) FetchEvents();
  }, [filters])




  const checkoutmodalfn = useCallback((value: boolean) => {

    setCheckoutModal(value)

  }, [checkoutModal])


  const [detailview, setDetailview] = useState(false)
  const [detailviewEvent, setDetailviewEvent] = useState<IEvent | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);

  const handleSelectSuggestions = (suggestion: any) => {
    if (!suggestion.lat || !suggestion.lon) return;
    isManualSelection.current = true
    setFilters(prev => ({
      ...prev,
      location: {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon)
      }
    }))
    setSuggestions([])
    setPlace(suggestion.display_name)
  }




  const handleSearch = useCallback((query: string) => {
    if (query && query.toString().trim() === "") {
      setFilters(prev => ({ ...prev, search: "" }))

    } else {
      setFilters(prev => ({ ...prev, search: query, page: '1' }))
    }
  }, [filters])

  const getSelectedFilters = (dateFilter: string, category: string, customDate?: string | null) => {

    setFilters(prev => ({
      ...prev,
      category,
      date: {
        ...prev.date,
        dateFilter,
        customDate: customDate as string ?? ""
      }
    }))
  }


  const detailView = async (value: boolean, event: IEvent, type: string) => {
    if (type === "detailedView") {
      setDetailview(value)
      console.log("detailedview event checking",event)
      setDetailviewEvent(event)
    }
  }
  const close = (value: boolean) => {
    setDetailview(value)
    setDetailviewEvent(null)
  }

  if (checkoutModal) {
    return (
      <>
        <CheckoutModal />
      </>
    )
  }
  return (

    <>
      <PageLayout>



        <BrowseEventSidebar getSelectedFilters={getSelectedFilters} />


        {detailview && detailviewEvent ? (
          <div className="w-full md:w-9/12 h-fit flex flex-col px-2 sm:px-3">
            <UserEventDetail event={detailviewEvent} close={close} checkoutmodalfn={checkoutmodalfn} />
          </div>
        ) : (
          <div className="w-full md:w-9/12 h-fit flex flex-col px-2 sm:px-3">
            <div className="text-white flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <select name="sort" value={filters.sort} onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sort: e.target.value,
                  page: '1'
                })
                )} className="border mt-0.5 border-white rounded-sm h-9 sm:h-10 w-full sm:w-auto text-sm sm:text-base bg-black text-white">
                <option value="" className="bg-black text-white">Sort</option>
                <option value="latest" className="bg-black text-white">Latest</option>
                <option value="price-low-to-high" className="bg-black text-white">Price Low to High</option>
                <option value="price-high-to-low" className="bg-black text-white">Price High to Low</option>
              </select>

              <div className="relative w-full flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter location (e.g Kochi)"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="h-9 sm:h-10 text-white bg-black px-3 sm:px-4 mt-0.5 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base"
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full left-0 top-full bg-black rounded mt-1 max-h-60 overflow-y-auto text-sm sm:text-base">
                      {suggestions.map((sug, idx) => (
                        <li
                          key={idx}
                          className="p-2 cursor-pointer text-white hover:bg-gray-700"
                          onClick={() => handleSelectSuggestions(sug)}
                        >
                          {sug.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Button onClick={() => {
                  setFilters(prev => ({ ...prev, location: { lat: 0, lng: 0 } }))
                  setPlace("")

                }} variant="outline">Clear</Button>
              </div>
              <div className="w-full sm:w-auto">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
            <div>
              {events.length > 0 ? (
                <>
                  {events.map((event) => (
                    <div className="py-2" key={event._id}>
                      <UserEventCardUI event={event} callback={detailView} />
                    </div>
                  ))}

                  {totalPages >= 4 ? <>
                    <div className="flex justify-center gap-1 sm:gap-2 mt-4 flex-wrap">
                      <button
                        disabled={Number(filters.page) === 1}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            page: String(Number(prev.page) - 1),
                          }))
                        }
                        className="bg-gray-700 text-white px-2 sm:px-3 py-1 rounded disabled:opacity-50 text-sm sm:text-base"
                      >
                        Prev
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              page: String(i + 1),
                            }))
                          }
                          className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${Number(filters.page) === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-black"
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        disabled={Number(filters.page) === totalPages}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            page: String(Number(prev.page) + 1),
                          }))
                        }
                        className="bg-gray-700 text-white px-2 sm:px-3 py-1 rounded disabled:opacity-50 text-sm sm:text-base"
                      >
                        Next
                      </button>
                    </div>

                  </> : null}

                </>
              ) : (
                <p className="text-center text-white text-sm sm:text-base md:text-lg p-4 rounded-lg shadow-md mt-4">
                  Sorry, we couldn't find any events near your selected location !!!
                </p>
              )}




            </div>
          </div>


        )}




      </PageLayout>

    </>

  )
}

export default BrowseEvent
