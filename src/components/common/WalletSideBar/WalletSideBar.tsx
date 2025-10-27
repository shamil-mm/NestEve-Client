import { BadgeIndianRupee, Wallet } from "lucide-react";


const WalletSideBar:React.FC<{ handlePageCB: (value:string) => void; }> = ({handlePageCB}) => {

    const OrganizerOptions = [
      { label: "Wallet",logo: <Wallet className="w-6 h-6 mr-2" /> ,
      onClick: () => handlePageCB("Wallet") },
      { label: "Transaction History",logo:<BadgeIndianRupee className="w-6 h-6 mr-2" />,
      onClick: () => handlePageCB("TRANSACTION-HISTORY") },
     
     
    ];
    return (
      <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 ml-0 sm:ml-3 md:ml-5 w-full sm:w-64 md:w-72 lg:w-80 h-auto bg-black/50 text-white border-blue-700 border-2 z-20 mb-4 sm:mb-0">
          <div className="p-3 sm:p-4">
            <nav>
              <ul className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
              {OrganizerOptions.map((option) => (
                    <li 
                     onClick={option.onClick}
                     key={option.label} 
                     className="flex items-center p-2 text-indigo-500 cursor-pointer hover:bg-black/30 transition rounded">
                    <span className="w-5 h-5 sm:w-6 sm:h-6">{option.logo}</span>
                    <span className="text-sm sm:text-base">{option.label}</span>
                  </li>
                  ))}
              </ul>
            </nav>
          </div>
        </div>
    )
  }
  
  export default WalletSideBar