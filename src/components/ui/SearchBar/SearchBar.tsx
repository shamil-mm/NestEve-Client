import React, { useState } from "react";
import Button from "../LandingPage/Button/Button";

interface SearchBarProps{
    placeholder?:string;
    onSearch:(query:string)=>void
}
const SearchBar:React.FC<SearchBarProps> = ({placeholder="search...",onSearch}) => {
    const [query,setQuery]=useState("")
    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value=e.target.value
        setQuery(value)
    }
    const handleSearch=()=>{ onSearch(query.trim())}

  return (
    <div className="w-full max-w-md  flex items-center space-x-2 ">
        <input 
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className=" w-full h-10 text-white bg-black px-4 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      <Button onClick={handleSearch} variant="outline">Search</Button>
    </div>
  )
}

export default SearchBar
