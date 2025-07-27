
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
interface QRCodeScannerProps {
  getDecodecId: (data: string) => void;
}

export const QRCodeScanner = ({getDecodecId}:QRCodeScannerProps) => {
    
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false 
    );
    scanner.render(
      (decodedText: string) => {
        getDecodecId(decodedText)
        scanner.clear();
      },
      (error: any) => {
           if (error.name === "NotFoundException") {
            return;
            } 
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);



  return (
   <div className=" text-black h-full w-full bg- flex flex-col items-center justify-center ">
        <h2 className="text-xl font-bold mb-10">Scan QR Code</h2>
        <div id="reader" className="w-full max-w-md aspect-square bg-white rounded-md" />
    </div>
  );
};
