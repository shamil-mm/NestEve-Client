export interface Location{
    lat:number;
    lng:number;
}
export interface LocationPickerProps{
    location:Location;
    setLocation:(loc:Location)=>void;
    height?:string;
    width?:string;
    zoom?:number;
    showmarker?:boolean;
}