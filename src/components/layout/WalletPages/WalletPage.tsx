import React from 'react';
import { Wallet, CreditCard} from 'lucide-react';
interface WalletpageProps{
    balance:number
}

const WalletPage: React.FC<WalletpageProps> = ({balance}) => {
  

  return (
    <div className="mt-29 ml-5 flex w-11/12 h-[calc(90vh-80px)] text-white ">
      {/* Left Section */}
      <div className="w-full p-6 bg-black/60 backdrop-blur-md overflow-y-auto border-1 border-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Wallet className="mr-2" /> My Wallet
          </h2>
         
        </div>

        {/* Wallet Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Balance</span>
              <CreditCard className="text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold mt-2">₹ {Number(balance).toFixed(2)}</h3>
          </div>
          {/* <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Pending Transactions</span>
              <ArrowUpRight className="text-green-400" />
            </div>
            <h3 className="text-3xl font-bold mt-2">2</h3>
          </div> */}
        </div>     
      </div>
    </div>
  );
};

export default WalletPage;