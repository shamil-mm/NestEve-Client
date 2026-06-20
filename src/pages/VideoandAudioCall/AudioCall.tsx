import { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

interface AudioCallProps {
  roomId?: string;
  userId?: string;
  userName?: string;
}

function randomID(len = 5): string {
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function AudioCall({ roomId, userId, userName }: AudioCallProps) {
  const callContainerRef = useRef<HTMLDivElement | null>(null);

  const roomID = roomId || randomID(5);
  const UID = userId || randomID(5);
  const UName = userName || "Guest_" + randomID(2);

  useEffect(() => {
    
      const appID = import.meta.env.VITE_ZEGOCLOUD_APPID;
      const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        UID,
        UName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: callContainerRef.current!,
        sharedLinks: [
          {
            name: 'Personal link',
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, 
        },
        showScreenSharingButton: false,
        showPreJoinView: false,
        turnOnCameraWhenJoining: false, 
        turnOnMicrophoneWhenJoining: true,
      });
       return () => {
        zp.destroy();
        };


  }, [roomID, UID, UName]);

  return (
    <div
      ref={callContainerRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
