
import {client} from './client'

export  const tagCreation=async(name:string)=>{
    try {
        console.log('tag creation service is working',name)
        const response =  await client.post(`/events/api/tags`,{name});
        console.log(response,"tag creation response")
        return response
        
    } catch (error) {
        console.error("Tag creation failed from service.ts", error);
    }
}
export  const getTags=async()=>{
    try {
        console.log('get tags service is working')
        const response =  await client.get(`/events/api/tags`);
        console.log(response,"get tags response")
        return response
        
    } catch (error) {
        console.error("Tag creation failed from service.ts", error);
    }
}
export  const blockList=async(_id:string,is_block:boolean)=>{
    try {
        console.log('block tag service is working')
        const response =  await client.post(`/events/api/block-tag`,{_id,is_block});
        console.log(response,"block tag response")
        return response
        
    } catch (error) {
        console.error("block category failed from service.ts", error);
    }
}
export  const fetchSingleTag=async(id:string)=>{
    try {
        console.log('fetchSingleTag service is working')
        const response =  await client.get(`/events/api/fetch-single-tag/${id}`);
        console.log(response,"fetchSingleTag response")
        return response
        
    } catch (error) {
        console.error("fetchSingleTag failed from service.ts", error);
    }
}
export  const editTag=async(name:string,id:string)=>{
    try {
        console.log(name,'editTag service is working',id)
        const response =  await client.patch(`/events/api/tag`,{name,id});
        console.log(response,"editTag response")
        return response
        
    } catch (error) {
        console.error("editTag failed from service.ts", error);
    }
}

export  const categoryCreation=async(categoryName:string,description:string)=>{
    try {
        console.log(categoryName,'Category creation service is working',description)
        const response =  await client.post(`/events/api/category`,{categoryName,description});
        console.log(response,"category creation response")
        return response
        
    } catch (error) {
        console.error("Category creation failed from service.ts", error);
    }
}
export  const editCategory=async(categoryName:string,description:string,id:string)=>{
    try {
        console.log(categoryName,'editCategory service is working',description,id)
        const response =  await client.patch(`/events/api/category`,{categoryName,description,id});
        console.log(response,"editCategory response")
        return response
        
    } catch (error) {
        console.error("Category creation failed from service.ts", error);
    }
}

export  const getcategories=async()=>{
    try {
        console.log('get Category service is working')
        const response =  await client.get(`/events/api/category`);
        console.log(response,"get category response")
        return response
        
    } catch (error) {
        console.error("get category failed from service.ts", error);
    }
}

export  const blockCategory=async(data:{id:string,is_block:boolean})=>{
    try {
        console.log('block Category service is working')
        const response =  await client.post(`/events/api/block-category`,data);
        console.log(response,"block category response")
        return response
        
    } catch (error) {
        console.error("block category failed from service.ts", error);
    }
}
export  const fetchSingleCategory=async(id:string)=>{
    try {
        console.log('fetchSingleCategory service is working')
        const response =  await client.get(`/events/api/fetch-single-category/${id}`);
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
        console.log('fetchCategoriesList service is working')
        const response =  await client.get(`/events/api/fetch-categories-list`);
        console.log(response,"fetchCategoriesList response")
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
        console.log('fetchEvents service is working')
        const response =  await client.get(`/events/api/fetch-events-list/${id}`);
        console.log(response,"fetchEvents response")
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

export const fetchAllEvents=async()=>{
    try {
        console.log('fetchAllEvents service is working')
        const response =  await client.get(`/events/api/fetch-all-events`);
      
        console.log("fetchAllEvents response",response)
        return response  
    } catch (error) {
        console.error("fetchAllEvents failed from service.ts", error);
    }
}
export const fetchEvent=async()=>{
    try {
        console.log('fetchEvent service is working')
        const response =  await client.get(`/events/api/fetch-events`);
        console.log("fetchEvent response",response)
        return response  
    } catch (error) {
        console.error("fetchEvent failed from service.ts", error);
    }

}

export const blockEvent=async(data:{id:string,is_block:boolean})=>{
    try {
        const response =  await client.post(`/events/api/block-event`,data);
                console.log(response,"block event response")
                return response
        
    } catch (error) {
        console.error("block event failed from service.ts", error);
    }
}
export const fetchSearchEvents=async(filterdata:{
    search:string,
    category:string,
    date:{
      dateFilter:string,
      customDate:string
    }
  })=>{
    try {
        console.log('fetchSearchEvents service is working')
        const params=new URLSearchParams();
        if(filterdata.search) params.append("search",filterdata.search)
        if(filterdata.category) params.append("category",filterdata.category)
        if(filterdata.date?.dateFilter) params.append("dateFilter",filterdata?.date?.dateFilter)
        if(filterdata.date?.customDate) params.append("customDate",filterdata.date?.customDate)
        const queryString=`?${params.toString()}`;
        console.log(queryString)
        const response =  await client.get(`/events/api/fetch-search-events${queryString}`);
      
        console.log("fetchSearchEvents response",response)
        return response  
    } catch (error) {
        console.error("fetchSearchEvents failed from service.ts", error);
    }
}