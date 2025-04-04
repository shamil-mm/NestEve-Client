import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import EventCreation from '../../../assets/eventCreation.jpg'
import MapIntegration from '../OrganizerCreateEvent/MapIntegration';
import { zodEventSchema } from '../../../schemas/eventSchema';
import { z } from 'zod';
const OrganizerCreateEvent:React.FC<{close: (value:boolean) => void}> = ({close}) => {

  const [search, setSearch] = useState<string|"">("");
  const handleSearch = async () => {
    if (!search) return;
    console.log(search)
  };








  const [formError,setFormError]=useState<Record<string,string>>({})
    const [previewImg,setPreviewImg]=useState<string|null>(null)
    const [error,setError]=useState("")

    const [row]=useState('3')
    const fileInputRef=useRef<HTMLInputElement | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        status: 'showing',
        ticketCharge: '',
        category: '',
        venue: '',
        capacity: '',
        location: '',
        latitude:"",
        longitude:""
      });
      useEffect(() => {
      }, [formError]);
      
    
      const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
      const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (file && file.type.startsWith('image/')) {
        const reader=new FileReader()
        reader.onloadend=()=>{
          setPreviewImg(reader.result as string)
        }  
        reader.readAsDataURL(file)
        
        }else{
          setPreviewImg(null)
          setError("please select a valid image file")
          return
        }
      };
    
      const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        console.log("image",previewImg)
        console.log("seach",search)
        console.log('Event data submitted:', formData);
        console.log({...formData,location:search,})
        if(!previewImg){
          setError("please select a image")
        }
        try {
          const result= zodEventSchema.parse({...formData,location:search,})
        console.log('valid event data',result)
        } catch (error) {
          if(error instanceof z.ZodError){
            const errors:Record<string,string>={};
            error.errors.forEach((err)=>{
              if(err.path.length>0){
                errors[err.path[0]]=err.message
              }
            })
            setFormError(errors)
            
          }
        }
        
        
      };
  return (
    <div className='w-90% border-2 border-blue-600 overflow-hidden' >
         <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-lg font-medium">Event Creation</h1>
        <button onClick={()=>close(false)} className="p-2">
        &larr; back
        </button>
      </header>

      <div className="p-4 mb-4">
        {previewImg ?(<img src={previewImg}  alt="Preview" className=" w-full  mb-6 relative rounded-lg overflow-hidden h-45 object-cover" />):(
          
        <div className="mb-6 relative rounded-lg overflow-hidden h-45" style={{backgroundImage:`url(${EventCreation})`, backgroundSize: 'cover', backgroundPosition: 'center',filter: 'brightness(0.8)'}}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div onClick={()=>fileInputRef.current?.click()} className="bg-black bg-opacity-60 p-4 rounded-lg text-center cursor-pointer">
            <div className="flex justify-center mb-2">
              <div className="text-blue-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        )}
     

        <div className="flex justify-center mb-6">
        {error?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {error}</span>:""}
          {/* <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-gray-600"></div>
            <div className="h-2 w-2 rounded-full bg-gray-600"></div>
          </div> */}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-1">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event title{formError.title?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.title}</span>:""}</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Write event name here, add emoji to stand out from the rest"
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">Add Tags</label>
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
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
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event description {formError.description?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.description}</span>:""}</label>
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
                <label className="block text-sm font-medium mb-1">Start Date {formError.startDate?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.startDate}</span>:""}</label>
                <div className="flex items-center border border-gray-700 rounded-lg">
                  <Calendar size={16} className="ml-3 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-3 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date{formError.endDate?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.endDate}</span>:""}</label>
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
                <label className="block text-sm font-medium mb-1">Time {formError.startTime?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.startTime}</span>:""}</label>
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
                <label className="block text-sm font-medium mb-1">Door Time {formError.endTime?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.endTime}</span>:""}</label>
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
                <label className="block text-sm font-medium mb-1">Status {formError.status?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.status}</span>:""}</label>
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
                <label className="block text-sm font-medium mb-1">Ticket charge{formError.ticketCharge?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.ticketCharge}</span>:""}</label>
                <input
                  type="text"
                  name="ticketCharge"
                  value={formData.ticketCharge}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none"
                >
                  <option value="">Select category</option>
                  <option value="music">Music</option>
                  <option value="art">Art</option>
                  <option value="food">Food</option>
                  <option value="sports">Sports</option>
                </select>
                
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Venue{formError.venue?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.venue}</span>:""}</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue"
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Capacity {formError.capacity?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.capacity}</span>:""}</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Number of guests"
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none"
                />
              </div>


              {/* here i am working  */}


              <div>
                <label className="block text-sm font-medium mb-1">Location{formError.location?<span className='text-red-500'>&nbsp;  &nbsp; &nbsp; * {formError.location}</span>:""}</label>
                <div className="flex items-center border border-gray-700 rounded-lg">
                  <input
                    type="text"
                    name="location"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search location"
                    className="w-full p-3 bg-transparent focus:outline-none"
                  />

                  <MapPin size={16} className="mr-3 text-blue-500" />
                  <button type='button' onClick={handleSearch} className="ml-2 p-2 bg-transparent text-white rounded">
                    Search
                  </button>
                </div>
              </div>

              {/* here i am working  */}   



            </div>
            <MapIntegration/>
           
            <div className=" flex justify-center">
              <button
                type="submit"
                className="min-w-1/4 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
              >
                CREATE EVENT
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
