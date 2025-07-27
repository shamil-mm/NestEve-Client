export const getCurrentUserLocation=():Promise<GeolocationPosition>=>{
    return new Promise((resolve,reject)=>{
        if(!navigator.geolocation){
            reject(new Error('Geolocation is not supported by your brower'))
        }else{
            navigator.geolocation.getCurrentPosition(resolve,reject,{
                enableHighAccuracy:true,
                timeout:10000
            })
        }
    })
}