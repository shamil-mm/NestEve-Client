import Navbar from "../../components/common/Navbar/Navbar"
import hero from '../../assets/abstract-background.jpg'
import WalletSideBar from "../../components/common/WalletSideBar/WalletSideBar"
import { useEffect, useState } from "react"
import WalletPage from "../../components/layout/WalletPages/WalletPage"
import TransactionPage from "../../components/layout/WalletPages/TransactionPage"
import { getwallet } from "../../services/bookingService"
import { useAppSelector } from "../../hooks/AuthHook"
import { ITransaction, IWallet } from "../../interfaces/IWallet"


const Wallet = () => {
     const [correntOption,setCorrentOption]=useState<string|null>("Wallet")
       const { user } = useAppSelector((state) => state.authUser)
       const [wallet,setWallet]=useState<IWallet|null>(null)
    const handlePageCB=(value:string)=>{
        setCorrentOption(value)
    }


    useEffect(()=>{
        async function getWallet(){
            const res=await getwallet(user?.id as string)
            setWallet(res?.data.data)
        }
        getWallet()
    },[])
    console.log(wallet)
  return (
 
    <div className="relative h-screen flex flex-col">

<div className="absolute inset-0">
  <img src={hero} alt="concert crowd" className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
</div>
<Navbar />
<div className="flex flex-1 overflow-hidden">
    <WalletSideBar handlePageCB={handlePageCB}/>


    <div className="flex-1 overflow-auto">
        {correntOption === "Wallet" && <WalletPage balance={wallet?.balance as number}/> }
        {correntOption === "TRANSACTION-HISTORY" && <TransactionPage transaction={wallet?.transaction as ITransaction[]}/>}
    </div>
</div>
  


</div>
  )
}

export default Wallet