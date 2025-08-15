import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import EventCreation from '../../../assets/eventCreation.jpg'
import { zodEventSchema, zodSeatingLayoutSchema, createZodTickenTypesSchema } from '../../../schemas/eventSchema';
import { z } from 'zod';
import TagSelecter from '../../ui/OrganizerEvent/TagSelecter';
import { fetchCategoriesList, updateEvent } from '../../../services/EventServices';
import { toast } from 'react-fox-toast';
import { IEvent, ILayoutConfig } from '../../../interfaces/IEvent';
import { useAppSelector } from '../../../hooks/AuthHook';
import "react-datepicker/dist/react-datepicker.css";
import { generateBalancedLayouts, getRowCountFromRange } from '../../../utils/eventCreationHelperFunction/ColumnSuggestion';
import EventLocationPicker from '../../common/Location/EventLocationPicker';





interface OrganizerCreateEventProps {
  close: (value: boolean) => void;
  onSuccess?: (value: string) => void;
  editEvent?: IEvent

}
const OrganizerCreateEvent: React.FC<OrganizerCreateEventProps> = ({ close, onSuccess, editEvent }) => {

  
  const userId = useAppSelector((state) => state.authUser?.user?.id)
  // const handleSearch = async () => {
  //   if (!search) return;
  //   console.log(search)
  // };
  const [editevent] = useState(editEvent)
  const [formError, setFormError] = useState<Record<string, string>>({})
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [img, setImg] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [locationError, setLocationError] = useState("")

  const [row] = useState('3')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedTags, setSelectedTags] = useState<{ _id: string; tag: string; }[]>([]);
  const [categoryList, setCategoryList] = useState<{ _id: string; categoryName: string; }[]>([])
  const [seatedEvent, setSeatedEvent] = useState(editEvent?.is_seated ? true : false)
  const [rowSuggestionflag, setRowSuggestionflag] = useState(false)
  const [suggestions, setSuggestions] = useState<{ rows: number, columns: number }[]>([])
  const [rowSuggestions, setRowSuggestions] = useState<number[]>([])
  const Rowref = useRef(null)
  const Columnref = useRef(null)
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    status: 'showing',
    category: '',
    location: []as number[],
    is_seated: false
  });
  useEffect(() => {
    if (editevent) {
      setFormData({
        title: editevent.title || '',
        description: editevent.description || '',
        startDate: editevent.startDate?.split('T')[0] || '',
        endDate: editevent.endDate?.split('T')[0] || '',
        startTime: editevent.startTime || '',
        endTime: editevent.endTime || '',
        status: editevent.status || 'showing',
        category: editEvent?.category._id || '',
        location: [editevent.location.coordinates[0],editevent.location.coordinates[1]] ,
        is_seated: editevent.is_seated || false
      })
      if (editevent.tags) {
        const resultTag = editevent.tags.map((value: { _id: string, tag: string }) => {
          return { _id: value._id, tag: value.tag }
        })
        setSelectedTags(resultTag)
      }

      // setSearch(editevent.locationName || "")
      if (editevent.image) {
        setPreviewImg(editevent.image)
      }
    }


  }, [editevent])

  useEffect(() => {
  }, [formError]);
  useEffect(() => {
    const fetchcategories = async () => {

      try {
        const res = await fetchCategoriesList()

        if (res?.data?.categoris) {
          setCategoryList(res?.data?.categoris)
        }

      } catch (error) {
        console.error("Failed to fetchcategories", error);
      }

    }
    fetchcategories()

  }, [])


  const [ticketTypes, setTicketTypes] = useState<{ name: string; price: string; capacity: number }[]>(
    editEvent?.ticketTypes?.length
      ? editEvent.ticketTypes.map(ticket => ({
        name: ticket.name,
        price: ticket.price.toString(),
        capacity: ticket.capacity
      }))
      : [{ name: "General", price: "", capacity: 0 }]
  );

  const handleTicketTypeChange = (index: number, field: string, value: string | number) => {
    const updatedTickets = [...ticketTypes];
    (updatedTickets[index] as any)[field] = value;
    setTicketTypes(updatedTickets);

    if (field === "name") {
      setLayoutConfig(prev => {
        const updatedCategories = [...prev.categories];
        if (updatedCategories[index]) {
          updatedCategories[index].name = value as string;
        }
        return {
          ...prev,
          categories: updatedCategories
        } 
      });
    }
  };




  const addTicketType = () => {
    setTicketTypes(prev => [
      ...prev,
      { name: "", price: "", capacity: 0 }
    ])
    setLayoutConfig(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          name: "",
          rowRange: [""],
          price: 0
        }
      ]
    }));
  };




  const removeTicketType = (index: number) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets.splice(index, 1);
    setTicketTypes(updatedTickets);

    setLayoutConfig(prev => {
      const updatedCategories = [...prev.categories];
      updatedCategories.splice(index, 1);
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };


  const [layoutConfig, setLayoutConfig] = useState<ILayoutConfig>(
    editEvent?.layoutConfig ?
      editEvent.layoutConfig
      :
      {
        rows: 0,
        columns: 0,
        seatStyle:'',
        passageRows:[],
        passageColumns:[],
        categories: [{name: "General", rowRange: [""], price: 0 }]
      });

      const [passageRowsInput, setPassageRowsInput] = useState(layoutConfig.passageRows.join(','));
      const [passageColumnsInput, setPassageColumnsInput] = useState(layoutConfig.passageColumns.join(','));

  const handleLayoutChange = (field: string, value: any) => {
    if (field === "rows") {

      const match = suggestions.find(item => item.rows === value);


      setLayoutConfig((prev) => ({
        ...prev,
        rows: value,
        columns: match ? match.columns : prev.columns,
      }));
    } else if (field === "columns") {

      setLayoutConfig((prev) => ({
        ...prev,
        columns: value,
      }));
    }else if(field==='seatStyle'){
      setLayoutConfig(prev=>({
        ...prev,
        seatStyle:value
      }))
    }else if(field ==='passageRows'){
      setLayoutConfig(prev=>({
        ...prev,
        passageRows:value.split(',').map((v:string)=>parseInt(v)).filter((n:number)=>!isNaN(n))
      }))
    }else if(field=== 'passageColumns'){
      setLayoutConfig(prev=>({
        ...prev,
        passageColumns:value.split(',').map(((v:string)=>parseInt(v))).filter((n:number)=>!isNaN(n))
      }))
    }
  };

  const handleCategoryChange = (index: number, field: string, value: string | number | string[]) => {
    const newCategories = [...layoutConfig.categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setLayoutConfig({
      ...layoutConfig,
      categories: newCategories
    });
  };

 
  const handleSelectedTag = useCallback((tags: { _id: string; tag: string }[]) => {
    setSelectedTags(tags)
  }, [])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'is_seated' ? value === 'yes' : value
    }));
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    setImg(file)
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImg(reader.result as string)
      }
      reader.readAsDataURL(file)

    } else {
      setPreviewImg(null)
      setError("please select a valid image file")
      return
    }
  };




  //handle submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submit is working')
    console.log(layoutConfig)

    setFormError({})
    setError("")
    setLocationError("")


    

    const tagIds = selectedTags.map((tag) => tag._id)
    if (!previewImg) {
      setError("please select a image")
      return
    }
 const geolocation=[location?.lng,location?.lat]

    try {

      const result = zodEventSchema.parse({ ...formData ,location:geolocation})
      let stanitizeTicketTypes;
      let sanitizeLayoutConfig;
      try {
        const ZodTicketTypesSchema = createZodTickenTypesSchema(seatedEvent)
        stanitizeTicketTypes = ZodTicketTypesSchema.parse(ticketTypes)
        if (seatedEvent) {
          sanitizeLayoutConfig = zodSeatingLayoutSchema.parse(layoutConfig)
        }
      } catch (error) {

        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path.length > 0) {
              const key = typeof err.path[1] === 'string' ? err.path[1] : err.path[0];

              errors[key] = err.message;
              console.log(key, err.message)
            }
          })
          setFormError(errors)
          return;
        }
      }
      if (!location?.lat || !location.lng) {
      setLocationError('Please select a location')
      return
    }

   
      const eventPayload = {
        ...result,
        tags: tagIds,
        ticketTypes: stanitizeTicketTypes,
        ...(seatedEvent && { layoutConfig: sanitizeLayoutConfig }),
        is_seated: seatedEvent
      }

      console.log("eventpayload : ", eventPayload)

      let response;
      if (editevent) {
        response = await updateEvent(editevent._id, eventPayload, img as File ?? undefined)

      } else {
        if (userId) {
          // response = await createEvent(eventPayload, img as File, userId)
        }
      }

      console.log('res', response)
      if (response?.data?.message === "Event created successfully.") {

        toast.success(response?.data?.message)
        if (onSuccess) {
          onSuccess('EVENTS')
        }

      } else if (response?.data?.message === "Event updated successfully.") {
        toast.success(response?.data?.message)
        if (onSuccess) {
          onSuccess('EVENTS')
          setFormData((prev) => ({
            ...prev,
            image: previewImg

          }));
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            console.log(err.path[0], err.message)
            errors[err.path[0]] = err.message
          }
        })
        setFormError(errors)

      }
    }
  }





  const handleRowSuggestions = (value: string) => {
    const totalSeats = ticketTypes.reduce((sum, t) => sum + t.capacity, 0)

    const suggestion = generateBalancedLayouts(totalSeats)
    if (value === 'raw') {
      setRowSuggestionflag(true)
      setSuggestions(suggestion)
      setRowSuggestions(suggestions.map((value) => value.rows))
    }
  }



  const handleLocationSelect = (selectedLocation: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setLocation(selectedLocation);
  };







  return (
    <div className='w-90% border-2 border-blue-600 overflow-hidden' >
      <div className="flex flex-col min-h-screen bg-black text-white">
        <header className="p-4 border-b border-gray-800 flex justify-between items-center">
          {editevent ? <h1 className="text-lg font-medium">Update Event</h1> : <h1 className="text-lg font-medium">Event Creation</h1>}

          <button onClick={() => close(false)} className="p-2">
            &larr; back
          </button>
        </header>

        <div className="p-4 mb-4">
          <div className="mb-6 relative rounded-lg overflow-hidden h-45">
            {/* Background Image or Preview Image */}
            {previewImg ? (
              <img
                src={previewImg}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${EventCreation})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.8)',
                }}
              />
            )}

            {/* Upload Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-black bg-opacity-60 p-4 rounded-lg text-center cursor-pointer"
              >
                <div className="flex justify-center mb-2">
                  <div className="text-blue-500">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5V19M12 5L6 11M12 5L18 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-white text-sm">Upload Photo</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>


          <div className="flex justify-center mb-6">
            {error ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {error}</span> : ""}
            {/* <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-gray-600"></div>
            <div className="h-2 w-2 rounded-full bg-gray-600"></div>
          </div> */}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-1">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Event title{formError.title ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.title}</span> : ""}</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Write event name here, add emoji to stand out from the rest"
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <TagSelecter onTagsChange={handleSelectedTag} editTag={selectedTags} />




              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Event description {formError.description ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.description}</span> : ""}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write short engaging description that hooks visitors and tell them why they should come..."
                  rows={Number(row)}
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date {formError.startDate ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.startDate}</span> : ""}</label>
                  <div className="flex items-center border border-gray-700 rounded-lg">
                    <Calendar size={16} className="ml-3 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full p-3 bg-transparent text-white accent-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date{formError.endDate ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.endDate}</span> : ""}</label>
                  <div className="flex items-center border border-gray-700 rounded-lg">
                    <Calendar size={16} className="ml-3 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full p-3 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Time {formError.startTime ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.startTime}</span> : ""}</label>
                  <div className="flex items-center border border-gray-700 rounded-lg">
                    <Clock size={16} className="ml-3 text-gray-400" />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full p-3 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Door Time {formError.endTime ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.endTime}</span> : ""}</label>

                  <div className="flex items-center border border-gray-700 rounded-lg">
                    <Clock size={16} className="ml-3 text-gray-400" />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full p-3 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status {formError.status ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.status}</span> : ""}</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none"
                  >
                    <option value="showing">Showing</option>
                    <option value="hidden">Hidden</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category {formError.category ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.category}</span> : ""}</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none"
                  >
                    <option value="">Select category</option>
                    {categoryList && categoryList.map((category) => (
                      <option key={category._id} value={category._id}>{category.categoryName}</option>
                    ))}
                  </select>

                </div>



                <div>
                  <label className="block text-sm font-medium mb-1">Is Seated ? {formError.is_seated ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.is_seated}</span> : ""}</label>
                  <select
                    name="is_seated"
                    value={formData.is_seated ? "yes" : 'no'}
                    onChange={(e) => {
                      handleChange(e)
                      setSeatedEvent(e.target.value === "yes")
                    }}
                    className="w-full p-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none"
                  >
                    <option value="no">no</option>
                    <option value="yes">yes</option>
                  </select>
                </div>

              </div>





              <div className="grid grid-cols-2 gap-4 mb-4">

              </div>


              {seatedEvent ? (
                <>
                  {/* Ticket Types Section */}
                  <div className="mb-4 p-4 border border-white rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Ticket Types (<span className='text-sm'>add atleat one type</span>)</h3>

                    {ticketTypes.map((ticket, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name {formError.name ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.name}</span> : ""}</label>
                          <input
                            type="text"
                            name='name'
                            value={ticket.name}
                            onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                            placeholder="VIP, General, etc."
                            className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Capacity {formError.capacity ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.capacity}</span> : ""}</label>
                          <div className="flex items-center">
                            <input
                              type="string"
                              name='capacity'
                              value={ticket.capacity}
                              onChange={(e) => handleTicketTypeChange(index, 'capacity', parseInt(e.target.value) || 0)}
                              placeholder="100"
                              className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                            />
                            {ticketTypes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTicketType(index)}
                                className="ml-2 p-2 text-red-500"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addTicketType}
                      className="p-2 border border-gray-700 rounded-lg text-blue-500 hover:bg-gray-900"
                    >
                      + Add Ticket Type
                    </button>
                  </div>

                  {/* Seating Layout Configuration */}
                  <div className="mb-4 p-4 border border-white rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Seating Layout {formError.rows || formError.rows ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.rows || formError.columns}</span> : ""}</h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Rows</label>
                        <input
                          type="number"
                          ref={Rowref}
                          onFocus={() => handleRowSuggestions('raw')}
                          readOnly
                          value={layoutConfig.rows}
                          onChange={(e) => {
                            handleLayoutChange('rows', parseInt(e.target.value) || 0)
                          }}
                          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                        />

                        {rowSuggestionflag && rowSuggestions.length > 0 && (
                          <ul className="absolute bg-black border border-gray-300 mt-1 rounded shadow z-10 max-h-40 overflow-auto">
                            {rowSuggestions.map((suggestion) => (
                              <li
                                key={suggestion}
                                onClick={() => {
                                  handleLayoutChange("rows", suggestion);
                                  setRowSuggestionflag(false);
                                }}
                                className="cursor-pointer px-4 py-2"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        )}

                      </div>

                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Columns</label>
                        <input
                          ref={Columnref}
                          type="string"
                          value={layoutConfig.columns}
                          readOnly
                          onChange={(e) => handleLayoutChange('columns', parseInt(e.target.value) || 0)}
                          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">Seat Style {formError.seatStyle  ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * Select  style</span> : ""} </label>
                        <select
                          value={layoutConfig.seatStyle}
                          onChange={(e) => handleLayoutChange('seatStyle', e.target.value)}
                          className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:outline-none"
                        >
                          <option value="">Select style</option>
                          <option value="theater">Theater</option>
                          <option value="banquet">Banquet</option>
                          <option value="classroom">Classroom</option>
                        </select>
                      </div>


                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Passage Rows (use commas)</label>
                        <input
                        name='passageRows'
                          type="text"
                          value={passageRowsInput}
                          onChange={(e) => setPassageRowsInput(e.target.value)}
                          onBlur={() => handleLayoutChange('passageRows', passageRowsInput)}
                          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Passage Columns (use commas)</label>
                        <input
                        name="passageColumns"
                          type="text"
                            value={passageColumnsInput}
                            onChange={(e) => setPassageColumnsInput(e.target.value)}
                            onBlur={() => handleLayoutChange('passageColumns', passageColumnsInput)}
                          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <h4 className="text-md font-medium mb-2 mt-4">Seat Categories {formError.categories ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.categories}</span> : ""}</h4>

                    {layoutConfig.categories.map((category, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 mb-4 p-3 border border-gray-800 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input
                            type="text"
                            name='categoryname'
                            readOnly
                            value={category.name}
                            onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">  Row Range <span className='text-blue-600'>{getRowCountFromRange(category.rowRange[0])}</span> <span> ( eg A-E )</span></label>
                          <input
                            type="text"
                            name='rowrange'
                            value={category.rowRange[0]}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase()
                              if (value === '' || /^[A-Z]$/.test(value) || /^[A-Z]-$/.test(value) || /^[A-Z]-[A-Z]$/.test(value)) {
                                handleCategoryChange(index, 'rowRange', [value])
                              }
                            }
                            }

                            className="w-full  p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Price</label>
                          <div className="flex items-center">
                            <input
                              type="string"
                              value={category.price}
                              name='price'
                              onChange={(e) => handleCategoryChange(index, 'price', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                            />
                            {/* {layoutConfig.categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCategory(index)}
                                className="ml-2 p-2 text-red-500"
                              >
                                ✕
                              </button>
                            )} */}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* <button
                      type="button"
                      onClick={addCategory}
                      className="p-2 border border-gray-700 rounded-lg text-blue-500 hover:bg-gray-900"
                    >
                      + Add Category
                    </button> */}
                  </div>
                </>
              ) : (

                <div className="mb-4 p-4 border border-white rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Admission Tickets</h3>

                  {ticketTypes.map((ticket, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ticket Name {formError.name ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.name}</span> : ""}</label>
                        <input
                          type="text"
                          value={ticket.name}
                          name='name'
                          onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                          placeholder="General, VIP, Early Bird, etc."
                          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price{formError.price ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.price}</span> : ""}</label>
                        <input
                          type="string"
                          value={ticket.price}
                          name='price'
                          onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                          placeholder="0"
                          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantity Available {formError.capacity ? <span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.capacity}</span> : ""}</label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={ticket.capacity}
                            name='capacity'
                            onChange={(e) => handleTicketTypeChange(index, 'capacity', parseInt(e.target.value) || 0)}
                            placeholder="100"
                            className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                          />
                          {ticketTypes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTicketType(index)}
                              className="ml-2 p-2 text-red-500"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addTicketType}
                    className="p-2 border border-gray-700 rounded-lg text-blue-500 hover:bg-gray-900"
                  >
                    + Add Ticket Type
                  </button>
                </div>

              )}

              {locationError ? <span className='text-red-500 text-center'>&nbsp;  &nbsp; &nbsp; * {locationError}</span> : ""}
              {formError.location ? <span className='text-red-500 text-center'>&nbsp;  &nbsp; &nbsp; *  Location  {formError.location}</span> : ""}
              <EventLocationPicker onLocationSelect={handleLocationSelect} />


              <div className=" flex justify-center">
                <button
                  type="submit"
                  className="min-w-1/4 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  {editevent ? "UPDATE EVENT" : "CREATE EVENT"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default OrganizerCreateEvent
