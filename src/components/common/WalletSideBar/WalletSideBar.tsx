import { BadgeIndianRupee, Wallet } from "lucide-react";


const WalletSideBar:React.FC<{ handlePageCB: (value:string) => void; }> = ({handlePageCB}) => {

    const OrganizerOptions = [
      { label: "Wallet",logo: <Wallet className="w-6 h-6 mr-2" /> ,
      onClick: () => handlePageCB("Wallet") },
      { label: "Transaction History",logo:<BadgeIndianRupee className="w-6 h-6 mr-2" />,
      onClick: () => handlePageCB("TRANSACTION-HISTORY") },
     
     
    ];
    return (
      <div className="mt-28 ml-5 w-70 h-150 bg-black/50 text-white  border-blue-700 border-2 z-20">
          <div className="p-4">
            <nav>
              <ul className="space-y-10">
              {OrganizerOptions.map((option) => (
                    <li 
                     onClick={option.onClick}
                     key={option.label} 
                     className="flex items-center p-2 text-indigo-500 cursor-pointer">
                    <span>{option.logo}</span>
                    <span>{option.label}</span>
                  </li>
                  ))}
              </ul>
            </nav>
          </div>
        </div>
    )
  }
  
  export default WalletSideBar