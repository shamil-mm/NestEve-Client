import { client } from "./client"


export const postCreation= async(userId:string,eventId:string,data:{text:string,image:File})=>{
    try {
        const formData=new FormData()
        formData.append('image',data.image)
        formData.append('text',data.text)
        formData.append('userId',userId)
        formData.append('eventId',eventId)


       const response=await client.post(`/content/api/post`,formData,{
        headers:{"Content-Type": "multipart/form-data"},
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
            const percentCompleted = progressEvent.total 
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total) 
              : 0;
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
       })
       return response
        
    } catch (error) {
        console.log('error getting on getuser content moderation service' )
    }
}

export const fetchPosts= async(eventId:string)=>{
    try {
        const response=await client.get(`/content/api/post/${eventId}`)
        return response
    } catch (error) {
        console.log('error from fetch posts of events ',error)
    }
}
export const fetchLikes= async(postId:string)=>{
    try {
        console.log('featch likes is working')
        const response=await client.get(`/content/api/likes/${postId}`)
        return response
    } catch (error) {
        console.log('error from fetchLikes of events ',error)
    }
}
export const markLikes= async(postId:string,userId:string)=>{
    try {
        console.log('markLikes is working')
        const response=await client.post(`/content/api/likes`,{postId,userId})
        return response
    } catch (error) {
        console.log('error from markLikes ',error)
    }
}
export const makeComment= async(postId:string,userId:string,comment:string,parentCommentId:string)=>{
    try {
        console.log('makeCommment is working')
        const response=await client.post(`/content/api/comments`,{postId,userId,comment,parentCommentId})
        return response
    } catch (error) {
        console.log('error from makeCommment ',error)
    }
}
export const removePost= async(postId:string)=>{
    try {
        const response=await client.delete(`/content/api/post/${postId}`)
        return response
    } catch (error) {
        console.log('error from removePost of events ',error)
    }
}
export const getCommet= async(commentId:string)=>{
    try {
        const response=await client.get(`/content/api/get-comment/${commentId}`)
        return response.data
    } catch (error) {
        console.log('error from removePost of events ',error)
    }
}