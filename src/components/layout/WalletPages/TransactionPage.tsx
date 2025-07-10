import React from 'react';
import { ITransaction } from '../../../interfaces/IWallet';

interface TransactionPageProps{
  transaction:ITransaction[]
}

const TransactionPage: React.FC<TransactionPageProps> = ({transaction}) => {


  return (
    <div className="mt-29 ml-5 flex w-11/12 h-[calc(90vh-80px)] text-white ">
      <div className="w-full p-6 bg-black/60 backdrop-blur-md overflow-y-auto border-1 border-white">
        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
        {transaction.map((transaction,index) => (
          <div 
            key={index} 
            className="bg-white/10 mb-3 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{transaction.description}</p>
              <p className="text-sm text-gray-400">{new Date(transaction.createdAt).toDateString()}</p>
            </div>
            <span 
              className={`font-bold ${
                transaction.type === 'debit' 
                  ? 'text-red-600' 
                  : 'text-green-600'
              }`}
            >
              {transaction.type === 'debit' ? '-' : '+'} ₹{Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionPage;