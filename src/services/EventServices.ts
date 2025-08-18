
import { toast } from 'react-fox-toast';
import {client} from './client'
import {  AxiosError } from 'axios';

export  const tagCreation=async(name:string)=>{
    try {
        const response =  await client.post(`/events/api/admin/tags`,{name});

        return response
        
    } catch (error) {
        const err=error as AxiosError<{success:boolean,message:string}>
        if(err?.response?.status === 409){
            toast.info(err.response.data.message);
        }
        console.error("Tag creation failed from service.ts", error);
        return
    }
}
export  const getTags=async(searchTerm:string, sortField:string, sortDirection:string, filterBy:string, page:number, limit:number)=>{
    try {
        console.log('get tags service is working')
        const response =  await client.get(`/events/api/admin/tags`,{
         params: {
                    search: searchTerm,
                    sortField,
                    sortDirection,
                    filterBy,
                    page,
                    limit,
                },
        });
        
        return response
        
    } catch (error) {
        console.error("Tag creation failed from service.ts", error);
    }
}
export  const blockList=async(_id:string,is_block:boolean)=>{
    try {
        console.log('block tag service is working')
        const response =  await client.post(`/events/api/admin/block-tag`,{_id,is_block});
        console.log(response,"block tag response")
        return response
        
    } catch (error) {
        console.error("block category failed from service.ts", error);
    }
}
export  const fetchSingleTag=async(id:string)=>{
    try {
        console.log('fetchSingleTag service is working')
        const response =  await client.get(`/events/api/admin/fetch-single-tag/${id}`);
        console.log(response,"fetchSingleTag response")
        return response
        
    } catch (error) {
        console.error("fetchSingleTag failed from service.ts", error);
    }
}
export  const editTag=async(name:string,id:string)=>{
    try {
        console.log(name,'editTag service is working',id)
        const response =  await client.patch(`/events/api/admin/tag`,{name,id});
        return response
        
    } catch (error) {
         const err=error as AxiosError<{success:boolean,message:string}>
        if(err?.response?.status === 409){
            toast.info(err.response.data.message);
        }
        
        console.error("editTag failed from service.ts", error);
        return
    }
}

export  const categoryCreation=async(categoryName:string,description:string)=>{
    try {
        console.log(categoryName,'Category creation service is working',description)
        const response =  await client.post(`/events/api/admin/category`,{categoryName,description});
        console.log(response,"category creation response")
        return response
        
    } catch (error) {
        console.error("Category creation failed from service.ts", error);
    }
}
export  const editCategory=async(categoryName:string,description:string,id:string)=>{
    try {
        console.log(categoryName,'editCategory service is working',description,id)
        const response =  await client.patch(`/events/api/admin/category`,{categoryName,description,id});
        console.log(response,"editCategory response")
        return response
        
    } catch (error) {
        console.error("Category creation failed from service.ts", error);
    }
}

export  const getcategories=async(searchTerm:string, sortField:string, sortDirection:string, filterBy:string, page:number, limit:number)=>{
    try {
        console.log('get Category service is working')
        const response =  await client.get(`/events/api/admin/category`,{
             params: {
                    search: searchTerm,
                    sortField,
                    sortDirection,
                    filterBy,
                    page,
                    limit,
                },
        });
        
        return response
        
    } catch (error) {
        console.error("get category failed from service.ts", error);
    }
}

export  const blockCategory=async(data:{id:string,is_block:boolean})=>{
    try {
        console.log('block Category service is working')
        const response =  await client.post(`/events/api/admin/block-category`,data);
        console.log(response,"block category response")
        return response
        
    } catch (error) {
        console.error("block category failed from service.ts", error);
    }
}
export  const fetchSingleCategory=async(id:string)=>{
    try {
        console.log('fetchSingleCategory service is working')
        const response =  await client.get(`/events/api/admin/fetch-single-category/${id}`);
        return response
        
    } catch (error) {
        console.error("fetchSingleCategory failed from service.ts", error);
    }
}
export const fetchTagSuggestions=async(inputValue:string)=>{
    try {
        console.log('fetchTagSuggestions service is working')
        const response =  await client.get(`/events/api/suggestion-tags?query=${inputValue}`);
        console.log(response,"fetchTagSuggestions response")
        return response  
    } catch (error) {
        console.error("fetchTagSuggestions failed from service.ts", error);
    }
}
export const fetchCategoriesList=async()=>{
    try {
        
        const response =  await client.get(`/events/api/fetch-categories-list`);
        return response  
    } catch (error) {
        console.error("fetchCategoriesList failed from service.ts", error);
    }
}
export const createEvent=async(eventData:object,image:File,userId:string)=>{
    try {
        const formData=new FormData()
        for(const key in eventData){
            if(eventData.hasOwnProperty(key)){
                const value=(eventData as any)[key]

                if(typeof value==='object'){
                    formData.append(key,JSON.stringify(value))
                }else{
                    formData.append(key,value)
                }
            }
        }
        formData.append('image',image)
        
        
        const response =  await client.post(`/events/api/create-event/${userId}`
            ,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
            }
    );
        
        return response  
        
    } catch (error) {
        console.error("createEvent failed from service.ts", error); 
    }
}

export const fetchEvents=async(id:string)=>{
    try {

        const response =  await client.get(`/events/api/fetch-events-list/${id}`);
        
        return response  
    } catch (error) {
        console.error("fetchEvents failed from service.ts", error);
    }
}
export const getEventImage= async(eventImageUrl:string)=>{
    try {
      const response=await client.get(`/events/api/fetch-events-image`,{params:{eventImageUrl}})
      return response
    } catch (error) {
      console.error('Failed to get event image from s3', error);
      throw new Error('Failed to get event image from s3');
    }
  }

  export const updateEvent=async(id:string,eventData:object,image?:File)=>{
    try {
        const formData=new FormData()
        for(const key in eventData){
            if(eventData.hasOwnProperty(key)){
                const value=(eventData as any)[key]

                if(typeof value==='object'){
                    formData.append(key,JSON.stringify(value))
                }else{

                    formData.append(key,value)
                }
            }
        }
        formData.append('image',image as File)

         const response=await client.put(`/events/api/event/${id}`,
            formData,
            {
            headers:{
                'Content-Type':'multipart/form-data'
            }
         }
        )
        console.log("update event in service axios",response)
        return response  
        
        
    } catch (error) {
        console.error("update Event failed from service.ts", error);
    }
  }
export const removeEvent= async(eventId:string)=>{
    try {
        const response=await client.delete(`/events/api/event/${eventId}`)
      return response
        
    } catch (error) {
        console.error("remove Event failed from service.ts", error);
    }
}

export const fetchAllEvents=async(lat:number,lng:number)=>{
    try {
      
        const response =  await client.get(`/events/api/fetch-all-events`,{
            params:{
               lat,
               lng, 
            }
        });
      
       
        return response  
    } catch (error) {
        console.error("fetchAllEvents failed from service.ts", error);
    }
}
export const fetchEvent=async(searchTerm:string, sortField:string, sortDirection:string, filterBy:string, page:number, limit:number)=>{
    try {
        const response =  await client.get(`/events/api/admin/fetch-events`,{
        params: {
        search: searchTerm,
        sortField,
        sortDirection,
        filterBy,
        page,
        limit,
      },
        })
        return response  
    } catch (error) {
        console.error("fetchEvent failed from service.ts", error);
    }

}

export const blockEvent=async(data:{id:string,is_block:boolean})=>{
    try {
        const response =  await client.post(`/events/api/admin/block-event`,data);
                return response
        
    } catch (error) {
        console.error("block event failed from service.ts", error);
    }
}
export const fetchSearchEvents=async(filterdata:{
    search:string,
    category:string,
    sort:string,
    page:string,
    limit:string,
    location:{
        lat: number;
        lng: number;
    },
    date:{
      dateFilter:string,
      customDate:string
    }
  })=>{
    try {
      
        
        const params=new URLSearchParams();
        if(filterdata.search) params.append("search",filterdata.search)
        if(filterdata.category) params.append("category",filterdata.category)
        if(filterdata.sort) params.append("sort",filterdata.sort)
        if(filterdata.page) params.append("page",filterdata.page)
        if(filterdata.limit) params.append("limit",filterdata.limit)
        if(filterdata.date?.dateFilter) params.append("dateFilter",filterdata?.date?.dateFilter)
        if(filterdata.date?.customDate) params.append("customDate",filterdata.date?.customDate)
        if (filterdata.location?.lat) params.append("latitude", filterdata.location.lat.toString());
        if (filterdata.location?.lng) params.append("longitude", filterdata.location.lng.toString());
        
        const queryString=`?${params.toString()}`;

        const response =  await client.get(`/events/api/fetch-search-events${queryString}`);
        return response  
    } catch (error) {
        console.error("fetchSearchEvents failed from service.ts", error);
    }
   
}

export const fetchSingleEvent= async(id :string)=>{
    try {
        
        const response=await client.get(`/events/api/single-event/${id}`)
        return response
    } catch (error) {
        console.log('fetch single event failed',error)
    }

}
export const getFinanceData= async(id :string,page:number,limit:number,searchQuery:string,sortBy:string,filterBy:string)=>{
    try {
     
        const response=await client.get(`/events/api/finance/${id}`,{
            params:{
                page,
                limit,
                search:searchQuery,
                sortBy,
                filterBy
            }
        })
        return response
    } catch (error) {
        console.log('fetch getFinanceData failed',error)
    }

}
export const getLocationSuggestions= async(query:string)=>{
    try {
     
        const response=await client.get(`/events/api/search`, {
            params: { q: query }
            })
           
        return response
    } catch (error) {
        console.log('fetch getFinanceData failed',error)
    }

}
export const markReview =async (userId:string, eventId:string,rating:number,text:string)=>{
  try {
        const response=await client.post(`/events/api/review/${eventId}`, {userId,rating,text })
        return response.data
    } catch (error) {
        console.log('fetch markReview failed',error)
    }
}
export const fetchReviews =async (eventId:string,page:number,limit:number)=>{
  try {
        const response=await client.get(`/events/api/review/${eventId}`,{
            params:{
                page,limit
            }
        })
       
        return response.data
    } catch (error) {
        console.log('fetch FetchReviews failed',error)
    }
}
export const removeReviews =async (eventId:string)=>{
  try {
        const response=await client.delete(`/events/api/review/${eventId}`)
        return response.data
    } catch (error) {
        console.log('fetch FetchReviews failed',error)
    }
}

export const editReviews =async (reviewId:string,rating:number,text:string)=>{
  try {
        const response=await client.patch(`/events/api/review/${reviewId}`,{rating,text })
        return response.data
    } catch (error) {
        console.log('fetch FetchReviews failed',error)
    }
}

