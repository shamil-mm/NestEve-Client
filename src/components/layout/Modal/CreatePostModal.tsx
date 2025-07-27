import { useEffect, useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { postCreation } from '../../../services/content_codService';
import { IEvent } from '../../../interfaces/IEvent';
import { useAppDispatch, useAppSelector } from '../../../hooks/AuthHook';
import { toast } from 'react-fox-toast';
import { IPost } from '../../../interfaces/Ipost';
import { setTempPost } from '../../../store/slices/tempPost';
interface CreatePostModalProps{
    close:(value:boolean)=>void
    event:IEvent
    purpose:string
    currentPost?:Partial<IPost>
}
const CreatePostModal:React.FC<CreatePostModalProps> = ({event,close,purpose,currentPost}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {user} = useAppSelector((state) => state.authUser)
    const dispatch=useAppDispatch()

    useEffect(() => {
        if (currentPost) {
            if (currentPost.content) {
                setPostText(currentPost.content);
            }
            if (currentPost.media) {
                setImagePreview(currentPost.media as string);
            }
        }
    }, [currentPost]);
    
    const handleClose = () => {
        close(false)
      setIsOpen(false);
    };
    
    const handleTextChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
      setPostText(e.target.value);
    };
    
    const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
        if (!file.type.startsWith("image/")) {
          toast.warning("Only images allowed");
          return;
        }
      
        if (file.size > 5 * 1024 * 1024) {
          toast.warning("Image must be under 5MB");
          return;
        }
      
        setSelectedImage(file);
    };
    
    
    const handleSubmit = async() => {
        if(purpose==="create"){
          const tempPost:Partial<IPost>= {
            userId:{name:user?.name},
            content:postText,
            media:URL.createObjectURL(selectedImage as File),
            createdAt:new Date().toISOString(),
            comments:[],
            likes:[]

          };
          dispatch(setTempPost(tempPost))
        const result= await postCreation(user?.id as string,event._id,{ text: postText, image: selectedImage  as File})
            if(result){
                toast.success('Post created!');
            }
        }else if(purpose==="edit"){
            console.log(user?.id as string,event._id,{ text: postText, image: selectedImage  as File},currentPost?.media)
        }

      setIsOpen(false);
      handleClose()
    };
    
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-black border border-gray-700 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex flex-col h-full">
     
            <div className="flex items-center justify-between p-6 border-blue-800/30">
              <h2 className="text-2xl font-bold text-white">{currentPost ? 'Edit Post' : 'Create Post'}</h2>
              <button onClick={handleClose} className="p-2 hover:bg-blue-800/20 rounded-full transition-colors duration-200">
                <X size={24} className="w-5 h-5 text-gray-300 hover:text-white"/>
              </button>
            </div>
            <div className="flex items-center px-4 py-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                <img 
                  src='/asdfadsfadsfasf'
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="ml-3 font-medium text-white">{user?.name}</span>
            </div>
            
            <div className="px-4 py-2 flex-grow">
               <label className="block text-sm font-medium text-gray-200">
                            Your text *
                        </label>
              <textarea
                value={postText}
                onChange={handleTextChange}
                placeholder="Share your notes here"
                className="w-full px-4 py-3 bg-slate-800/50 border border-blue-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              />
            </div>
            
            {selectedImage ? (
            <div className="mt-4 flex justify-center">
                <div className="w-32 h-32 rounded overflow-hidden border text-center">
                <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            ):imagePreview && (
                <div className="mt-4 flex justify-center">
                    <div className="w-32 h-32 rounded overflow-hidden border text-center">
                    <img
                        src={imagePreview}
                        alt="Selected"
                        className="w-full h-full object-cover"
                    />
                    </div>
                </div>
                )}
            {/* {imagePreview && (
            <div className="mt-4 flex justify-center">
                <div className="w-32 h-32 rounded overflow-hidden border text-center">
                <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            )} */}
            <div className="px-4 py-4 flex justify-center">
              <label className="flex flex-col items-center cursor-pointer">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <PlusCircle className="text-white" size={24} />
                </div>
                <span className="mt-2 text-white">Add photos</span>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
            
            <div className="px-4 py-3">
              <button
                onClick={handleSubmit}
                disabled={!postText && selectedImage==null}
                className={`w-full py-3 rounded-md font-medium 
                  ${(postText || selectedImage) 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-blue-600 bg-opacity-50 text-white cursor-not-allowed'}`}
              >
                {currentPost ? 'Edit Post' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CreatePostModal
