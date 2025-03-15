export interface InputFieldProps{
label:string;
type:string;
value:string;
onChange:(event:React.ChangeEvent<HTMLInputElement>)=>void
placeholder:string;
required:boolean
}

export interface IAdminButton{
    type?:"button" | 'submit';
    text:string;
    onClick?:(event:React.MouseEvent<HTMLButtonElement>)=>void;
    icon?:React.ReactNode;
    primary?:boolean;
    secondary?:boolean;
    outline?:boolean;
    fullWidth?:boolean;

}

export interface IStatCard{
    title:string;
    value:string;
    icon:React.ReactNode;
    iconBg?:string;
    className?:string;
}