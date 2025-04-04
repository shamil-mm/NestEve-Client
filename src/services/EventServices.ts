
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
        console.log(response,"fetchSingleCategory response")
        return response
        
    } catch (error) {
        console.error("fetchSingleCategory failed from service.ts", error);
    }
}



