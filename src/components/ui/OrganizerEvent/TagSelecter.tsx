import { useEffect, useState } from "react";
import { fetchTagSuggestions } from "../../../services/EventServices";


type Tag = {
    _id: string;
    tag: string;
  };
interface TagSelecterProps {
    onTagsChange: (tags: Tag[]) => void;
    editTag:{_id:string,tag:string}[]
  }
  
const TagSelecter:React.FC<TagSelecterProps> = ({onTagsChange,editTag}) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [suggestions, setSuggestions] = useState<Tag[]>([]);
    useEffect(() => {
      if (editTag && editTag.length > 0) {
        setSelectedTags(editTag);
      }
    }, [editTag]);
    useEffect(() => {
        onTagsChange(selectedTags); 
      }, [selectedTags]);
    
    useEffect(()=>{
        const fetchSuggestions=async()=>{
            if(inputValue.trim()===''){
                setSuggestions([])
                return
            }
            if (selectedTags.length >= 2) {
                return;
            }
        try {
           const res=await fetchTagSuggestions(inputValue)
           if(res?.data?.tags){
            setSuggestions(res?.data?.tags)
           }

        } catch (error) {
            console.error("Failed to fetch suggestions", error); 
        }
    }
    const debounceTimeout=setTimeout(fetchSuggestions,500)
    return ()=>clearTimeout(debounceTimeout)

    },[inputValue,selectedTags])


    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const value = e.target.value;
        setInputValue(value);
      };
      const handleSelectTag = (e:React.MouseEvent<HTMLLIElement>,tag:Tag) => {
        e.preventDefault()
        const isAlreadySelected = selectedTags.some((t) => t._id === tag._id);
        if(!isAlreadySelected){
            setSelectedTags([...selectedTags, tag]);
            onTagsChange(selectedTags)
        }
        if (selectedTags.length >= 2 || isAlreadySelected) {
            return;
        }
        
        setInputValue('');
        setSuggestions([]);
      };
      const removeTag = (tagToRemove:Tag) => {
        setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
      };
    
    
  return (
    <>
    <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">Add Tags</label>
                {selectedTags&& 
                selectedTags.map((tag,index)=><span key={index} className="inline-block bg-black text-white border-1 border-white text-sm px-2 py-1 rounded mr-1 mb-1"> {tag.tag} <button
                onClick={() => removeTag(tag)}
                className="ml-2 hover:text-gray-300 text-red-600"
              >
                ×
              </button></span>)
                
                }
              </div>

              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                    <div className="relative w-full ">
                {selectedTags.length < 2 && (      
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-transparent border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 "
                    placeholder="Type to search tags..."
                  
                    
                />
                )}
                
                {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-black  shadow-md rounded-md z-10 mt-1 max-h-60 overflow-auto">
               
                {suggestions.map((tag) => (
                   
                  <li
                    key={tag._id}
                    onClick={(e) => handleSelectTag(e,tag)}
                    className=" text-white p-2 cursor-pointer hover:bg-gray-900"
                  >
                    {tag.tag}
                  </li>
                ))}
              </ul>
            )}
            </div>
                </div>
              </div>
            </div>
    </>
  )
}

export default TagSelecter
