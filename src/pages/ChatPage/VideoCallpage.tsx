import { useSearchParams } from 'react-router-dom';
import VideoCall from '../VideoandAudioCall/VideoCall';
import { useAppSelector } from '../../hooks/AuthHook';

const VideoCallPage = () => {
   const [searchParams] = useSearchParams();
   const roomId = searchParams.get("roomID");
  console.log("roomId",roomId)
  const user=useAppSelector((state)=>state.authUser.user)

  return (
    <VideoCall
      roomId={roomId || undefined}
      userId={user?.id}
      userName={user?.name}
    />
  );
};
export default VideoCallPage
