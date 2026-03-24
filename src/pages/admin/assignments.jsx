// src/pages/admin/assignment.jsx
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import { listContracts, listDevelopers, assignDeveloper } from "../../utility/adminApi.js";
import { Eye, X } from "lucide-react";
import { getAssignedTalentIds, isContractCompleted } from "../../utility/contractUtils.js";

/**
 * AssignmentPage (contracts-based)
 *
 * - Developers can be assigned multiple contracts (backend must allow).
 * - UI shows busy state and assigned count; busy devs are deprioritized in the list but still selectable.
 * - Responsive layout and improved mobile UX.
 */

export default function AssignmentPage() {
  const [contracts, setContracts] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState("pending"); // pending | assigned | completed
  const [selectedContract, setSelectedContract] = useState(null); // for view modal
  const [assigningContract, setAssigningContract] = useState(null); // contract being assigned (opens assign modal)
  const [selectedTalentId, setSelectedTalentId] = useState(null); // chosen talent id in modal (string)
  const [assigning, setAssigning] = useState(false);
  const [notice, setNotice] = useState(null); // { type, text }
  const [searchDev, setSearchDev] = useState("");

  // Load contracts + devs
  useEffect(() => {
    loadAll();
  }, []);

  // close modals on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectedContract(null);
        setAssigningContract(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [contractsRes, devsRes] = await Promise.all([listContracts(), listDevelopers()]);

      const norm = (r) => {
        if (Array.isArray(r)) return r;
        if (r?.data && Array.isArray(r.data)) return r.data;
        if (r?.data?.data && Array.isArray(r.data.data)) return r.data.data;
        return [];
      };

    const sortedContracts = norm(contractsRes).sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA; // newest first
    });

      setContracts(sortedContracts);
      setDevelopers(norm(devsRes));
    } catch (err) {
      console.error("Error loading assignment data:", err);
      setContracts([]);
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  }
  const isContractIncomplete = (c) => {
  return !(
    c.YourTitle &&
    (c.scopeOfWork || c.explanationOfScopeOfWork) &&
    (c.minimumToPayToTalent || c.paymentRate)
    );
  };

  // Partition contracts using shared helper for completed detection
  const pendingContracts = contracts.filter((c) => {
  const isAssigned = getAssignedTalentIds(c).length > 0;
  const isCompleted = isContractCompleted(c);
  const isIncomplete = isContractIncomplete(c);

  return !isAssigned && !isCompleted && isIncomplete;
});

const assignedContracts = contracts.filter((c) => {
  return getAssignedTalentIds(c).length > 0 && !isContractCompleted(c);
});

const completedContracts = contracts.filter((c) => {
  return isContractCompleted(c);
});

  // talent lookup (map by all id variants)
  const talentMap = useMemo(() => {
    const m = new Map();
    developers.forEach((d) => {
      if (d._id) m.set(String(d._id), d);
      if (d.talentId) m.set(String(d.talentId), d);
      if (d.id) m.set(String(d.id), d);
    });
    return m;
  }, [developers]);

  // Build a set of all assigned ids (strings) across contracts so availability checks are fast & accurate
  const allAssignedIdsSet = useMemo(() => {
    const s = new Set();
    contracts.forEach((c) => {
      getAssignedTalentIds(c).forEach((id) => {
        if (id != null) s.add(String(id));
      });
    });
    return s;
  }, [contracts]);

  // Build assigned counts per developer id (helps show how many contracts a dev has)
  const assignedCountById = useMemo(() => {
    const m = new Map();
    contracts.forEach((c) => {
      getAssignedTalentIds(c).forEach((id) => {
        if (!id) return;
        const k = String(id);
        m.set(k, (m.get(k) || 0) + 1);
      });
    });
    return m; // Map<string, number>
  }, [contracts]);

  // Get representative id variants for a developer object
  const getDeveloperIdVariants = (d) => {
    if (!d) return [];
    const ids = [];
    if (d._id) ids.push(String(d._id));
    if (d.talentId) ids.push(String(d.talentId));
    if (d.id) ids.push(String(d.id));
    return [...new Set(ids)];
  };

  // Accept either developer object or raw id string
  const isTalentAssigned = (devOrId) => {
    if (!devOrId) return false;
    if (typeof devOrId === "string") {
      return allAssignedIdsSet.has(String(devOrId));
    }
    const ids = getDeveloperIdVariants(devOrId);
    return ids.some((id) => allAssignedIdsSet.has(id));
  };

  // Count assigned contracts for a developer (by any id variant)
  const getAssignedCountForDeveloper = (d) => {
    const ids = getDeveloperIdVariants(d);
    let sum = 0;
    ids.forEach((id) => {
      sum += assignedCountById.get(String(id)) || 0;
    });
    return sum;
  };

  // Available developers (not assigned according to the contracts' assigned ids)
  const availableDevelopers = developers;

  const getAssignedDevelopersForContract = (contract) => {
    const ids = getAssignedTalentIds(contract);
    return ids.map((id) => talentMap.get(String(id)) || { _id: id, name: id });
  };

  // Format helpers
  const formatDate = (iso) => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleDateString();
  };

  const formatCurrency = (amt) => {
    if (amt == null || amt === "") return "Not specified";
    const num = Number(amt);
    if (isNaN(num)) return amt;
    return `$${num.toLocaleString()}`;
  };

  const getDevDisplayName = (d) =>
    [d?.firstName, d?.lastName].filter(Boolean).join(" ") || d?.name || d?.email || "Unknown";

  // Simple fit-scoring to highlight best matches (role/title & experience)
  const scoreDeveloperForContract = (dev = {}, contract = {}) => {
    let score = 0;
    const devText = `${dev.roleTitle || ""} ${dev.experienceLevel || ""} ${dev.skills ? dev.skills.join(" ") : ""}`.toLowerCase();
    const hireText = `${contract.roleTitle || contract.YourTitle || ""} ${contract.scopeOfWork || contract.explanationOfScopeOfWork || ""} ${contract.wantTalentAs || ""}`.toLowerCase();

    const hireWords = Array.from(new Set(hireText.split(/\W+/).filter(Boolean).slice(0, 30)));
    hireWords.forEach((w) => {
      if (w.length > 2 && devText.includes(w)) score += 2;
    });

    const devExp = (dev.experienceLevel || "").toLowerCase();
    const hireSen = (contract.seniorityLevel || "").toLowerCase();
    if (devExp && hireSen && devExp === hireSen) score += 3;
    if (devExp.includes("senior") && (hireSen.includes("mid") || hireSen.includes("junior"))) score += 1;

    return score;
  };

  // sorted developers when assigning -- show free first, then busy, each ranked by match score
  const sortedDevelopersForAssign = useMemo(() => {
    if (!assigningContract) return developers.slice();
    return developers
      .map((d) => {
        const assignedCount = getAssignedCountForDeveloper(d);
        return {
          dev: d,
          assignedCount,
          __score: scoreDeveloperForContract(d, assigningContract),
        };
      })
      .sort((a, b) => {
        // free first (assignedCount === 0), then by score desc, then by name
        if ((a.assignedCount === 0) !== (b.assignedCount === 0)) return a.assignedCount === 0 ? -1 : 1;
        if (b.__score !== a.__score) return b.__score - a.__score;
        const na = getDevDisplayName(a.dev).toLowerCase();
        const nb = getDevDisplayName(b.dev).toLowerCase();
        return na < nb ? -1 : na > nb ? 1 : 0;
      })
      .map((x) => x.dev);
  }, [developers, assigningContract, contracts, assignedCountById]);

  // assignment flow
  const openAssignModal = (contract) => {
    setAssigningContract(contract);
    setSelectedTalentId(null);
    setSearchDev("");
  };

  const closeAssignModal = () => {
    setAssigningContract(null);
    setSelectedTalentId(null);
    setSearchDev("");
  };

  const performAssignment = async () => {
    if (!assigningContract) return setNotice({ type: "error", text: "No contract selected" });
    if (!selectedTalentId) return setNotice({ type: "error", text: "Select a developer first" });

    setAssigning(true);
    setNotice(null);

    try {
      const talentIds = Array.isArray(selectedTalentId) ? selectedTalentId : [selectedTalentId];
      const contractId = assigningContract._id || assigningContract.contractId || assigningContract.id;

      // send to backend
      const res = await assignDeveloper(talentIds, contractId);

      // consider several "success" shapes
      const success = res?.ok || res?.status === "success" || (res?.data && !res.data.error) || res?.status === 200;

      if (!success) {
        setNotice({ type: "error", text: res?.error || res?.message || "Assignment failed" });
        return;
      }

      // Optimistically update local contracts so UI updates immediately:
      setContracts((prev) =>
        prev.map((c) => {
          const id = c._id || c.contractId || c.id;
          if (!id) return c;
          if (String(id) === String(contractId)) {
            const existing = getAssignedTalentIds(c);
            const combined = Array.from(new Set([...existing.map(String), ...talentIds.map(String)]));
            // prefer to set talentAssignedId if that key exists, otherwise set talentIds
            return { ...c, talentAssignedId: combined, talentIds: combined };
          }
          return c;
        })
      );

      setNotice({ type: "success", text: "Developer assigned successfully! Owner will now see the contract." });
      closeAssignModal();

      // refresh from server for final sync (but UI already updated optimistically)
      await loadAll();
    } catch (err) {
      console.error("Assign error:", err);
      setNotice({ type: "error", text: err?.message || "An error occurred while assigning." });
    } finally {
      setAssigning(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  // Derived visible contracts
  const visibleContracts = activeTab === "pending" ? pendingContracts : activeTab === "assigned" ? assignedContracts : completedContracts;

  if (loading) {
    return (
      <AdminLayout title="Assignment Manager">
        <div className="p-6 text-center">Loading assignment data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Assignment Manager">
      {notice && (
        <div className={`mb-4 p-3 rounded ${notice.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {notice.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "pending", label: "Pending", count: pendingContracts.length },
            { key: "assigned", label: "Assigned", count: assignedContracts.length },
            { key: "completed", label: "Completed", count: completedContracts.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded ${activeTab === t.key ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-700"}`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="ml-auto text-sm text-gray-600">Total Contracts: {contracts.length} · Developers: {developers.length}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Contracts */}
        <div className="lg:col-span-2 space-y-4">
          {visibleContracts.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center text-gray-500">
              {activeTab === "pending" ? "No pending contracts." : activeTab === "assigned" ? "No assigned contracts." : "No completed contracts."}
            </div>
          ) : (
            visibleContracts.map((contract) => {
              const assignedList = getAssignedDevelopersForContract(contract);
              return (
                <div key={contract._id || contract.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-semibold text-black truncate">
                        {contract.YourTitle || contract.roleTitle || contract.contractName || "Contract / Project"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 truncate">
                        Client: {contract.name || contract.clientName || "Unknown"} · {contract.whereYouLive || contract.state || contract.country || ""}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {contract.paymentPattern ? `${contract.paymentPattern} · ${formatCurrency(contract.minimumToPayToTalent || contract.minimum_to_pay_to_talent || contract.paymentRate)}` : `Budget: ${formatCurrency(contract.minimumToPayToTalent || contract.paymentRate)}`}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <div className="text-sm text-gray-500">{formatDate(contract.createdAt)}</div>
                      <div className="flex gap-2">
                        <button title="View details" onClick={() => setSelectedContract(contract)} className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">
                          <Eye className="h-4 w-4" />
                        </button>

                        <button onClick={() => openAssignModal(contract)} 
                          className="px-3 py-1 rounded bg-black text-white hover:bg-gray-900">
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>

                  {assignedList.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="text-xs text-gray-500">Assigned Developers ({assignedList.length})</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {assignedList.map((t) => (
                          <span key={t._id || t.id || t.name} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {getDevDisplayName(t)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT: Talent pool + summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-black">Talent Pool</h4>
              <div className="text-xs text-gray-500">Available: {availableDevelopers.length}</div>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {developers.length === 0 && <div className="text-sm text-gray-500">No developers found.</div>}

              {developers.map((d) => {
                const assignedCount = getAssignedCountForDeveloper(d);
                const assigned = assignedCount > 0;
                return (
                  <div key={(d._id || d.talentId || d.id) || Math.random()} className="p-3 border border-gray-100 rounded flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-black truncate">{getDevDisplayName(d)}</div>
                      <div className="text-xs text-gray-500 truncate">{d.roleTitle || d.experienceLevel || ""}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-xs px-2 py-1 rounded ${assigned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {assigned ? `Busy · ${assignedCount}` : "Free"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Summary</div>
            <div className="mt-3 flex gap-6">
              <div>
                <div className="text-2xl font-bold text-black">{pendingContracts.length}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{assignedContracts.length}</div>
                <div className="text-xs text-gray-500">Assigned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{completedContracts.length}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW CONTRACT modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedContract(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedContract.YourTitle || selectedContract.roleTitle || "Contract Details"}</h2>
                <p className="text-sm text-gray-500">{selectedContract.name || selectedContract.clientName || ""}</p>
              </div>
              <div>
                <button onClick={() => setSelectedContract(null)} className="p-2 rounded hover:bg-gray-100"><X /></button>
              </div>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Contact</div>
                  <div className="font-medium">{selectedContract.email || "Not provided"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="font-medium">{selectedContract.whereYouLive || selectedContract.city || selectedContract.state || selectedContract.country || "Not provided"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Payment</div>
                  <div className="font-medium">{selectedContract.paymentPattern || formatCurrency(selectedContract.minimumToPayToTalent || selectedContract.paymentRate) }</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Dates</div>
                  <div className="font-medium">{formatDate(selectedContract.createdAt)} {selectedContract.workStartDate ? `· Start: ${selectedContract.workStartDate}` : ""}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Description / Scope</div>
                  <div className="font-medium whitespace-pre-wrap">{selectedContract.scopeOfWork || selectedContract.explanationOfScopeOfWork || "Not provided"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Assigned Developers</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getAssignedDevelopersForContract(selectedContract).length === 0 ? (
                      <span className="text-xs text-gray-500">None</span>
                    ) : (
                      getAssignedDevelopersForContract(selectedContract).map((t) => (
                        <span key={t._id || t.id} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {getDevDisplayName(t)}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setSelectedContract(null)} className="px-4 py-2 rounded border">Close</button>
              {!isContractCompleted(selectedContract) && (
                <button onClick={() => { setSelectedContract(null); openAssignModal(selectedContract); }} className="px-4 py-2 rounded bg-black text-white">Assign</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN modal */}
      {assigningContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => closeAssignModal()}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between flex-col sm:flex-row gap-3 sm:gap-0">
              <div>
                <h3 className="text-lg font-bold">{assigningContract.YourTitle || assigningContract.roleTitle || "Assign Developer"}</h3>
                <div className="text-xs text-gray-500">Client: {assigningContract.name || assigningContract.clientName || "Unknown"}</div>
              </div>
              <button onClick={() => closeAssignModal()} className="p-2 rounded hover:bg-gray-100"><X /></button>
            </div>

            <hr className="my-4" />

            <div className="mb-3">
              <input
                value={searchDev}
                onChange={(e) => setSearchDev(e.target.value)}
                placeholder="Search developers (name, role, level)..."
                className="w-full border px-3 py-2 rounded focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {sortedDevelopersForAssign.filter(d => {
                const q = searchDev.trim().toLowerCase();
                if (!q) return true;
                return (getDevDisplayName(d) + " " + (d.roleTitle || "") + " " + (d.experienceLevel || "")).toLowerCase().includes(q);
              }).map((d) => {
                // pick a stable id to send to the backend (prefer talentId, fallback to _id or id)
                const talentId = d.talentId || d._id || d.id;
                const assignedCount = getAssignedCountForDeveloper(d);
                const isBusy = assignedCount > 0;
                return (
                  <label key={talentId} className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="selectedTalent"
                      value={talentId}
                      checked={selectedTalentId === talentId}
                      onChange={() => setSelectedTalentId(talentId)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{getDevDisplayName(d)}</div>
                      <div className="text-xs text-gray-500 truncate">{d.roleTitle || d.experienceLevel || ""}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded ${isBusy ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {isBusy ? `Busy · ${assignedCount}` : "Free"}
                      </div>
                    </div>
                  </label>
                );
              })}

              {sortedDevelopersForAssign.length === 0 && <div className="text-sm text-gray-500">No developers found.</div>}
            </div>

            {/* Busy warning + actions */}
            <div className="mt-4">
              {selectedTalentId && (() => {
                // find selected dev
                const dev = developers.find(d => {
                  const ids = getDeveloperIdVariants(d);
                  return ids.includes(String(selectedTalentId));
                });
                const assignedCount = dev ? getAssignedCountForDeveloper(dev) : 0;
                if (assignedCount > 0) {
                  return (
                    <div className="mb-3 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                      This developer already has <strong>{assignedCount}</strong> assigned contract{assignedCount > 1 ? "s" : ""}. You may still assign additional contracts, but please confirm.
                    </div>
                  );
                }
                return null;
              })()}
              <div className="flex justify-end gap-2">
                <button onClick={() => closeAssignModal()} className="px-4 py-2 rounded border">Cancel</button>
                <button
                  onClick={() => performAssignment()}
                  className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
                  disabled={assigning}
                >
                  {assigning ? "Assigning..." : (selectedTalentId && (() => {
                    const dev = developers.find(d => getDeveloperIdVariants(d).includes(String(selectedTalentId)));
                    const assignedCount = dev ? getAssignedCountForDeveloper(dev) : 0;
                    return `${assignedCount} active assignment(s)`
                  })()) || "Assign Developer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// small helper used inside JSX (kept at bottom for readability)
function getDeveloperIdVariants(d) {
  if (!d) return [];
  const ids = [];
  if (d._id) ids.push(String(d._id));
  if (d.talentId) ids.push(String(d.talentId));
  if (d.id) ids.push(String(d.id));
  return [...new Set(ids)];
}
