// src/pages/admin/contracts.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import { listContracts } from "../../utility/adminApi.js";
import { Search, Filter, Eye, X } from "lucide-react";

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null); // for modal view

  useEffect(() => {
    loadContracts();
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedContract(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- helper to pick best timestamp for sorting ---
  const getContractTime = (c) => {
    // prefer updatedAt, then createdAt, then startDate
    const t = c?.updatedAt || c?.createdAt || c?.startDate || null;
    const n = t ? Date.parse(t) : NaN;
    return isNaN(n) ? 0 : n;
  };

  const loadContracts = async () => {
    setLoading(true);
    try {
      const data = await listContracts();
      const arr = Array.isArray(data)
        ? data
        : data && Array.isArray(data.data)
        ? data.data
        : [];

      // SORT: newest first based on updatedAt -> createdAt -> startDate
      arr.sort((a, b) => getContractTime(b) - getContractTime(a));

      setContracts(arr);
    } catch (err) {
      console.error("Error loading contracts:", err);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const formatDate = (iso) => {
    if (!iso) return "Not set";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString();
  };

  const deriveStatus = (contract) => {
    if (contract?.isCompleted) return "completed";
    if (contract?.progress) {
      const p = String(contract.progress).toLowerCase();
      if (p.includes("signed")) return "signed";
      if (p.includes("review")) return "review";
      if (p.includes("compensation")) return "compensation";
      if (p.includes("job-details")) return "job-details";
      return p;
    }
    const now = new Date();
    const start = contract?.startDate ? new Date(contract.startDate) : null;
    const end = contract?.endDate ? new Date(contract.endDate) : null;
    if (start && !isNaN(start) && end && !isNaN(end)) {
      if (now < start) return "upcoming";
      if (now >= start && now <= end) return "active";
      if (now > end) return "completed";
    } else if (start && !isNaN(start)) {
      return now < start ? "upcoming" : "active";
    } else if (end && !isNaN(end)) {
      return now > end ? "completed" : "active";
    }
    return "pending";
  };

  const getStatusBadge = (contract) => {
    const status = deriveStatus(contract);
    const statusStyles = {
      completed: "bg-green-100 text-green-800",
      signed: "bg-blue-100 text-blue-800",
      review: "bg-yellow-100 text-yellow-800",
      compensation: "bg-purple-100 text-purple-800",
      "job-details": "bg-gray-100 text-gray-800",
      upcoming: "bg-yellow-100 text-yellow-800",
      active: "bg-blue-100 text-blue-800",
      pending: "bg-gray-100 text-gray-800",
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.pending}`;
  };

  const formatPayment = (contract) => {
    const rate = contract?.paymentRate ?? contract?.payment_rate ?? null;
    const freq = contract?.paymentFrequency ?? contract?.payment_frequency ?? null;
    if (rate == null && !freq) return "Not specified";
    const num = Number(rate);
    const formatted = !isNaN(num) ? `$${num.toLocaleString()}` : rate || "";
    return freq ? `${formatted} · ${freq}` : formatted || "Not set";
  };

  // Search
  const filteredContracts = contracts.filter((contract) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const fieldsToSearch = [
      contract?.clientName,
      contract?.companyName,
      contract?.roleTitle,
      contract?.scopeOfWork,
      contract?.explanationOfScopeOfWork,
      contract?.email,
      contract?.country,
      contract?.region,
      contract?.contractType,
      contract?.paymentFrequency,
    ];
    return fieldsToSearch.some((f) => (f || "").toString().toLowerCase().includes(q));
  });

  // Modal open/close helpers
  const openView = (contract) => setSelectedContract(contract);
  const closeView = () => setSelectedContract(null);

  // Render
  if (loading) {
    return (
      <AdminLayout title="Contract Management">
        <div className="p-6 text-center">Loading contracts...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contract Management">
      {/* Search & actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, company, role, region..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => loadContracts()}
            title="Refresh"
          >
            <Filter className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract, index) => (
                  <tr key={contract._id || contract.id || index} className="hover:bg-gray-50">
                    {/* Contract (role / short explanation / dates) */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-black">
                        {contract.roleTitle ||
                          contract.scopeOfWork ||
                          (contract.explanationOfScopeOfWork
                            ? contract.explanationOfScopeOfWork.length > 80
                              ? contract.explanationOfScopeOfWork.slice(0, 77) + "..."
                              : contract.explanationOfScopeOfWork
                            : "Contract")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(contract.startDate || contract.createdAt)}{" "}
                        {contract.endDate ? `— ${formatDate(contract.endDate)}` : ""}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{contract.clientName || "Unknown Client"}</div>
                      <div className="text-sm text-gray-500">{contract.email || "No email"}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(contract)}>{deriveStatus(contract)}</span>
                    </td>

                    {/* Budget */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-black">{formatPayment(contract)}</div>
                      <div className="text-xs text-gray-500">Amount · Frequency</div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {(contract.country || "Unknown") + (contract.region ? `, ${contract.region}` : "")}
                      </div>
                    </td>

                    {/* Actions (only view) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openView(contract)}
                          className="p-2 bg-black text-white rounded-md hover:bg-gray-900"
                          title="View contract"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? "No contracts found matching your search." : "No contracts available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {selectedContract && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeView} // click overlay to close
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black">
                  {selectedContract.roleTitle || "Contract Details"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{selectedContract.clientName || "Unknown Client"}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={getStatusBadge(selectedContract)}>{deriveStatus(selectedContract)}</span>
              </div>
            </div>

            <hr className="my-4" />

            {/* Body */}
            <div className="space-y-4 text-sm text-gray-800">
              <div>
                <div className="text-xs text-gray-500">Company</div>
                <div className="font-medium">{selectedContract.companyName || "Not provided"}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Contact</div>
                <div className="font-medium">{selectedContract.email || "Not provided"}</div>
                <div className="text-sm text-gray-500">{(selectedContract.country || "") + (selectedContract.region ? `, ${selectedContract.region}` : "")}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Scope / Role</div>
                <div className="font-medium">{selectedContract.scopeOfWork || selectedContract.explanationOfScopeOfWork || "Not provided"}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Seniority</div>
                <div className="font-medium">{selectedContract.seniorityLevel || "Not set"}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Start — End</div>
                <div className="font-medium">
                  {formatDate(selectedContract.startDate || selectedContract.createdAt)} {selectedContract.endDate ? `— ${formatDate(selectedContract.endDate)}` : ""}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Payment</div>
                <div className="font-medium">{formatPayment(selectedContract)}</div>
              </div>

              {selectedContract.signature && (
                <div>
                  <div className="text-xs text-gray-500">Signature / Uploaded</div>
                  <img src={selectedContract.signature} alt="signature" className="mt-2 max-h-48 object-contain border rounded" />
                </div>
              )}

              <div>
                <div className="text-xs text-gray-500">Progress</div>
                <div className="font-medium">{selectedContract.progress || "Not set"}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Created / Updated</div>
                <div className="font-medium">{formatDate(selectedContract.createdAt)} — {formatDate(selectedContract.updatedAt)}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeView}
                className="px-4 py-2 rounded bg-black text-white hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
