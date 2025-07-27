import  QrCode  from "react-qr-code"


const TicketQRCode = ({ticketId}:{ticketId:string}) => {
    const qrValue= `${ticketId}` 
  return (
        <QrCode value={qrValue} size={100} />
  )
}

export default TicketQRCode
