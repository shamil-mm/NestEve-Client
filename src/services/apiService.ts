import { client } from './client';

export const getDashboardData= async(organizerId:string)=>{
    try {
        const res=await client.get(`/organizer/dashboard?organizerId=${organizerId}`)
        return res
        
    } catch (error) {
        console.log('fetch getDashboardData failed',error) 
    }
}

export const getAdminDashboardData=async()=>{
    try {
          const response = await client.get('/api/admin/admin-dashboard');
    return response.data
    } catch (error) {
       console.error('Error fetching admin dashboard data:', error);
       throw error; 
    }
}