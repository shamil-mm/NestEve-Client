import { SetStateAction, useEffect, useState } from "react";
import AdminCommonLayout from "../../components/common/Admin/AdminCommonLayout";
import { fetchPaymentAndTransaction } from "../../services/bookingService";
import { Search } from "lucide-react";

interface Transaction {
  paymentId: string;
  user: {
    name: string;
    email: string;
  };
  event: {
    title: string;
  };
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const PaymentAndTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterBy, setFilterBy] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
          async function fetchTransactiondata(){
            const res = await fetchPaymentAndTransaction(searchTerm, sortField, sortDirection, filterBy, page, limit)
            setTransactions(res?.data?.transactions)
            setTotalPages(res?.data.totalPages)

        }
        fetchTransactiondata()
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [searchTerm, sortField, sortDirection, filterBy, page, limit]);

  const handleSort = (field: SetStateAction<string>) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };
  
  
    const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
      setSearchTerm(e.target.value);
      setPage(1)
    };
  

  return (
    <AdminCommonLayout>
       <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow">

        <div className="flex justify-between items-center p-4">
              <h2 className="text-xl font-semibold">Payment and Transactions</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="mr-2">Sort by</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={sortField}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="createdAt">Date</option>
                    <option value="paymentStatus">Payment Status</option>
                    <option value="paymentMethod">Payment Method</option>
                    <option value="paymentId">Payment ID</option>
                    <option value="status">Booking Status</option>
                    <option value="verified">Verification</option>
                  </select>
                </div>
                {/* <div className="flex items-center">
                  <span className="mr-2">Sort Order</span>
                  <select id="sortDirection"
                   className="border rounded px-2 py-1"
                    value={sortDirection}
                    onChange={(e) =>{
                      e.preventDefault()
                      handleSort(e.target.value)}}
                  >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                </div> */}
                <div className="flex items-center">
                  <span className="mr-2">Filter by</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="">All</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded-md pl-10 pr-4 py-1 w-64"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>

              </div>
            </div>


     
        <div className="overflow-x-auto  rounded-md shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-blue-600 text-white">
              <tr className="bg-blue-600 text-left text-sm font-semibold text-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold">Txn ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Event</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((txn,_i) => (
                <tr key={_i} className="border-b text-sm">
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.paymentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.user.name} <br /></td>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.event.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">₹{txn.totalAmount}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.paymentStatus}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{new Date(txn.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="mt-4 text-gray-500">No transactions found.</p>
          )}
        </div>
        <div className="flex justify-center p-4 space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-gray-100 rounded">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
     
      </div>
      </div>
    </AdminCommonLayout>
  );
};

export default PaymentAndTransactions;
