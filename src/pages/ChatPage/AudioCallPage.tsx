import { useSearchParams } from 'react-router-dom';
import AudioCall from '../VideoandAudioCall/AudioCall';
import { useAppSelector } from '../../hooks/AuthHook';

const AudioCallPage = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomID");

  const user = useAppSelector((state) => state.authUser.user);

  return (
    <AudioCall
      roomId={roomId || undefined}
      userId={user?.id}
      userName={user?.name}
    />
  );
};

export default AudioCallPage;
