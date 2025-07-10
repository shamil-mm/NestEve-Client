import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Pencil, Reply, Send, Trash2, X } from 'lucide-react';
import { IEvent } from '../../../interfaces/IEvent';
import {  fetchPosts, getCommet, makeComment, markLikes, removePost } from '../../../services/content_codService';
import { IPost } from '../../../interfaces/Ipost';
import { useAppDispatch, useAppSelector } from '../../../hooks/AuthHook';
import { clearTempPost } from '../../../store/slices/tempPost';
import Swal from 'sweetalert2';
import CreatePostModal from '../Modal/CreatePostModal';
import { IUser } from '../../../interfaces/Iuser';

type Icomment= {
    _id:string
    userId: Partial<IUser>;
    comment: string;
    parentCommentId?:string
}

interface PostsCarouselProps{
    event:IEvent
}

 const PostsCarousel:React.FC<PostsCarouselProps>=({event})=> {
    const {user} = useAppSelector((state) => state.authUser)
    const {tempPost}=useAppSelector((state)=>state.tempPost)
    const dispatch=useAppDispatch()
   
    const [showPostModal,setShowPostModal]=useState(false)
    const [post,setPost]=useState<Partial<IPost>[]>([])
    const [currentPost,setcurrentPost]=useState<Partial<IPost>|null>(null)

    const [isliked,setIsLiked]=useState<boolean>(false)
    const[replaySelected,setReplaySelected]=useState<Icomment|null>(null)
 
//   useEffect(()=>{
//     async function fetchposts(){
//         const response= await fetchPosts(event._id as string)
//         setPost(response?.data?.posts)
//     }
//     fetchposts()
//   },[])

  useEffect(() => {
    async function fetchposts() {
      const response = await fetchPosts(event._id as string);
      setPost(response?.data?.posts);
    }
    if (event._id) {
      fetchposts();
    }
  }, [event._id]);
  
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [command, setCommand] = useState('');
  const [showComments, setShowComments] = useState(false);
  

  useEffect(() => {
    if (tempPost && Object.keys(tempPost).length > 0) {
      setcurrentPost(tempPost);
    } else if (post.length > 0 && currentPostIndex < post.length) {
      setcurrentPost(post[currentPostIndex]);
    }
  }, [tempPost, post, currentPostIndex]);
  
  useEffect(() => {
    if (currentPost && currentPost.likes && user?.id) {
      const liked = currentPost.likes.some((like: { userId: string }) => like.userId === user.id);
      if(liked){
          setIsLiked(true);
      }else {
      setIsLiked(false);
    }
    }
  }, [currentPost, user?.id]);

  const makingLike = async(e: React.MouseEvent<SVGSVGElement, MouseEvent>, postId: string) => {
    e.preventDefault();
    
    if (!user?.id || !currentPost) return;
    const newLikedState = !isliked;
    setIsLiked(newLikedState);
    
    if (currentPost?.likes) {
      const currentLikes = [...currentPost.likes];
      
      if (newLikedState) {
        if (!currentLikes.some((like: {userId: string}) => like.userId === user.id)) {
          currentLikes.push({userId: user.id});
        }
      } else {
        const index = currentLikes.findIndex((like: {userId: string}) => like.userId === user.id);
        if (index !== -1) {
          currentLikes.splice(index, 1);
        }
      }
      setcurrentPost({
        ...currentPost,
        likes: currentLikes
      });
    }

    await markLikes(postId, user.id as string);
  }

  
  const goToNextPost = () => {
    dispatch(clearTempPost())
    setCurrentPostIndex((prevIndex) => (prevIndex + 1) % post.length);
    setShowComments(false);
  };

  const goToPrevPost = () => {
    dispatch(clearTempPost())
    setCurrentPostIndex((prevIndex) => (prevIndex - 1 + post.length) % post.length);
    setShowComments(false);
  };
  

  const handleCommandSubmit = async() => {
    if (!command.trim() || !user?.id || !currentPost) return
   let  replayPerson
    if(replaySelected?._id){
       replayPerson=await getCommet(replaySelected._id)
    }
    const newComment = {
        userId: { name: user.name, id: user.id },
        postId:currentPost._id,
        comment: command,
        ...(replaySelected?._id && { parentCommentId: {_id:replaySelected._id,comment:replayPerson.comment.comment,userId:{name:replayPerson.comment.userId.name}}}),
      };
      console.log(newComment)
     

      const updatedComments = [...(currentPost.comments ?? []), newComment];
  setcurrentPost({
    ...currentPost,
    comments: updatedComments,
  });

    await makeComment(currentPost?._id as string, user?.id as string,command as string,replaySelected?._id as string)
   
      setCommand('');
      setReplaySelected(null)
    
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const deletePostFn=async(e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    try {
      const result=await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'my-swal-popup',
                title: 'my-swal-title',
                htmlContainer: 'my-swal-text',
                icon: 'my-swal-icon',
                confirmButton: 'my-swal-confirm',
                cancelButton: 'my-swal-cancel'
              }
            
          })

          if(result.isConfirmed){
           
            await removePost(currentPost?._id as string)
            const updatedPosts = post.filter((p) => p._id !== currentPost?._id);
            setPost(updatedPosts);



            if (updatedPosts.length === 0) {
                setcurrentPost(null);
              } else {
                const newIndex = currentPostIndex >= updatedPosts.length ? 0 : currentPostIndex;
                setCurrentPostIndex(newIndex);
                setcurrentPost(updatedPosts[newIndex]);
              }

              await Swal.fire('Deleted!', 'Your post has been deleted.', 'success')
          }

        
    } catch (error) {
        console.log('error from delete post function ',error)
    }
    
  }

  const editPostFn=()=>{
    try {
        console.log('edit post function is working')
        setShowPostModal(prev=>!prev)
    } catch (error) {
        console.log('error founded on edit psot function',error)
    }
  }

  function closeFN(value:boolean){
    setShowPostModal(value)
  }

  const handleReplayComment=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>,comment:Icomment)=>{
    e.preventDefault()
    console.log('handleReplay comment is working ',comment)
      setReplaySelected(comment) 
  }





console.log(currentPost?.comments)

  



  return (
    <div className="text-white flex flex-col items-center ">
      
      <div className="relative w-full max-w-md">
        {/* Post Card */}
        <div className="bg-gray-900 rounded-lg overflow-hidden mx-4 border border-gray-800 min-h-[540px]">
          {/* Post Header */}
          
          <div className="flex items-center justify-between p-3">
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                {/* <img 
                  src={"dhaklh"} 
                  alt={currentPost?.userId?.name}
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <span className="ml-2 font-bold capitalize">{currentPost?.userId?.name} <small className="ml-2 font-mono text-gray-400 "> {currentPost?.createdAt && 
  new Date(currentPost.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}</small></span>
            </div>
            <span className="text-gray-400 text-sm">
                 <button onClick={editPostFn}><Pencil  size={20} color='yellow' /></button> &nbsp;
                 <button onClick={deletePostFn}><Trash2 size={20} color='red'/></button>
                 {showPostModal && (<CreatePostModal event={event} close={closeFN} purpose={"edit"} currentPost={currentPost as Partial<IPost>}/>)}
            </span>
            
          </div>
          
          {/* Post Image */}

          {currentPost?.media &&(
            <div className="w-full aspect-video bg-gray-800">
            <img 
              src={currentPost?.media} 
              alt="Post content"
              className="w-full h-full object-cover"
            />
          </div>

          )}
          
           
          {/* Like and Comment section */}
          <div className="p-3">
            <div className="flex space-x-4 mb-2">
              <div className="flex items-center">
                <Heart onClick={(e)=>makingLike(e,currentPost!._id as string)} size={20}   className={`mr-1 cursor-pointer ${isliked ? 'text-red-500 fill-red-500' : ''}`} />
                <span className="text-sm">{currentPost?.likes?.length} likes</span>
              </div>
              <div className="flex items-center">
              <MessageCircle size={20}/>&nbsp;
                <span className="text-sm"> {currentPost?.comments?.length} Commands</span>
              </div>
            </div>
            
            {/* Caption */}
            <div className="text-center text-white p-2 rounded mb-3 overflow-auto w-[350px]">
                <p className='pb-2'>{currentPost?.content}</p>
                <hr />
            </div>
               
            {/* Comments Preview - Show only the latest comment when not expanded */}
                        {!showComments && currentPost && currentPost?.comments!.length > 0 && (
                <div className="mb-3">
                  <div className="bg-gray-800 p-2 rounded flex items-start">
                    {/* Profile Picture */}
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                      {/* <img 
                        src={currentPost?.comments[0].profilePic} 
                        alt={currentPost.comments[0].username}
                        className="w-full h-full object-cover"
                      /> */}
                    </div>

                    {/* Name + Comment + Reply Icon container */}
                    <div className="flex justify-between items-start w-full">
                      {/* Name + Comment vertically */}
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">
                          {currentPost!.comments![currentPost!.comments!.length - 1].userId.name}
                        </span>
                        <span className="text-gray-300 text-sm mt-1">
                          {currentPost!.comments![currentPost!.comments!.length - 1].comment}
                        </span>
                      </div>

                      {/* Reply Icon to the far right */}
                      {/* <div className="ml-4 text-gray-400 hover:text-white cursor-pointer">
                        <Reply />
                      </div> */}
                    </div>
                  </div>
                </div>
              )}

            {/* View Comments Button */}
            <div 
              className="text-sm text-blue-400 mb-3 cursor-pointer"
              onClick={toggleComments}
            >
              {showComments ? 'hide comments' : `view Commands (${currentPost && currentPost?.comments!.length})`}
            </div>
            
            
            {/* Comments Modal */}
            {showComments && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10" onClick={toggleComments}>
                <div className="bg-gray-900 rounded-lg w-full max-w-sm mx-4 p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Comments</h3>
                    <button onClick={toggleComments} className="text-gray-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* Scrollable Comments List */}
                  <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                    {currentPost!.comments!.map((comment,index) => (
                      <div key={index} className="bg-gray-800 p-2 rounded flex items-start group transition">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                          {/* <img 
                            src={comment.profilePic} 
                            alt={comment.username}
                            className="w-full h-full object-cover"
                          /> */}
                        </div>
                        <div className='flex-1 flex justify-between items-start'>
                          <div className='flex flex-col'>
                          <span className="text-white font-semibold text-sm">{comment.userId.name}</span>
                           {comment?.parentCommentId && (
                              <div className="bg-gray-700 p-2 rounded mb-1 text-sm text-gray-300 border-l-4 border-blue-500 pl-2">
                                <div className="text-blue-400 font-semibold mb-1">
                                  Replying to: {comment?.parentCommentId?.userId?.name || 'Unknown'}
                                </div>
                                <div className="italic text-gray-300">
                                  {comment.parentCommentId.comment}
                                </div>
                              </div>
                            )}
                          <span className="text-gray-300 text-sm mt-1">{comment.comment}</span>
                          </div>
                        </div>
                          <div className='ml-4 text-gray-400 hover:text-white cursor-pointer hidden group-hover:block'>
                           <button onClick={(e)=>{handleReplayComment(e,comment as Icomment)}} className='flex justify-end'><Reply/></button>
                          </div>
                      </div>
                    ))}
                  </div>


                  
                 
                            {replaySelected && (
                      <div className="relative bg-gray-800 border border-white rounded-sm p-4 mb-3 shadow-sm">
                        <div className="text-sm text-white mb-1 font-semibold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4.293 9.707a1 1 0 010-1.414L10.586 2H7a1 1 0 010-2h7a1 1 0 011 1v7a1 1 0 11-2 0V4.414l-6.293 6.293a1 1 0 01-1.414 0z" />
                          </svg>
                          Replying to: <span>{replaySelected.userId?.name}</span>
                        </div>

                        <div className="text-sm text-white italic pl-4 border-l-2 border-white">
                          {replaySelected.comment}
                        </div>

                        <button
                          onClick={() => setReplaySelected(null)}
                          className="absolute top-1 right-2 text-xs text-red-800 hover:text-red-1000 transition"
                          title="Cancel reply"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                  <div className="flex items-center bg-gray-800 rounded p-1">
                    <input
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-grow bg-transparent border-none focus:outline-none text-sm px-2"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCommandSubmit();
                        }
                      }}
                    />
                    <button 
                      onClick={handleCommandSubmit}
                      className="bg-blue-600 rounded p-1"
                    >
                      <Send size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Command Input */}
            <div className="flex items-center bg-gray-800 rounded p-1">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Type your Command here..."
                className="flex-grow bg-transparent border-none focus:outline-none text-sm px-2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCommandSubmit();
                  }
                }}
              />
              <button 
                onClick={handleCommandSubmit}
                className="bg-blue-600 rounded p-1"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <button 
          onClick={goToPrevPost}
          className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
        >
          &#10094;
        </button>
        <button 
          onClick={goToNextPost}
          className="absolute -right-5 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
export default PostsCarousel
