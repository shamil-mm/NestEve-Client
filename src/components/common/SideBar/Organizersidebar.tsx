

const Organizersidebar:React.FC<{ handlePageCB: (value:string) => void; }> = ({handlePageCB}) => {

  const OrganizerOptions = [
     { label: "DASHBOARD",logo: <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M3 3h7v7H3z"></path>
  <path d="M14 3h7v4h-7z"></path>
  <path d="M14 10h7v11h-7z"></path>
  <path d="M3 14h7v7H3z"></path>
</svg>, 
    onClick: () => handlePageCB("DASHBOARD") },
    { label: "HOME",logo: <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>, 
    onClick: () => handlePageCB("HOME") },
   
    { label: "EVENTS",logo:<svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>, 
    onClick: () => handlePageCB("EVENTS") },
    { label: "ORDERS",logo:<svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>, 
    onClick: () => handlePageCB("ORDERS") },
    { label: "SCAN QRCODE",logo:<svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
  <line x1="8" y1="12" x2="16" y2="12" />
</svg>, 
    onClick: () => handlePageCB("SCANQRCODE")},
    { label: "FINANCE",logo:<svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>, 
    onClick: () => handlePageCB("FINANCE")},
  ];
  return (
    <div className="w-80 h-150 bg-black/50 text-white  border-blue-700 border-2">
        <div className="p-4">
          <nav>
            <ul className="space-y-10">

            {OrganizerOptions.map((option) => (
                  <li onClick={option.onClick} key={option.label} className="flex items-center p-2 text-indigo-500 cursor-pointer">
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

export default Organizersidebar
