// src/pages/admin/assignment.jsx
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import { listContracts, listDevelopers, assignDeveloper } from "../../utility/adminApi.js";
import { Eye, X, RefreshCw, Users, FileText, CheckCircle, Clock } from "lucide-react";
import { getAssignedTalentIds } from "../../utility/contractUtils.js";

// ─── Contract completeness logic ────────────────────────────────────────────────
//
// A contract is COMPLETE when ALL of these are present and non-empty:
//   • roleTitle                      (what role is being hired for)
//   • scopeOfWork OR explanationOfScopeOfWork   (description of work)
//   • paymentRate OR minimumToPayToTalent        (compensation)
//   • startDate                      (when work begins)
//
// A contract is ASSIGNED when:
//   • talentAssignedId has ≥ 1 entry AND
//   • at least one of those IDs resolves to a real developer in the system
//     (we check this with a Set of known talentIds built from the developers list)
//
// A contract is PENDING (incomplete) when the completeness check fails.
//
// NOTE: "assigned" takes priority over "completed" — an assigned contract is always
// shown in the Assigned tab, never in Completed, even if it is also "complete".
// ────────────────────────────────────────────────────────────────────────────────

const isNonEmpty = (v) => v !== null && v !== undefined && String(v).trim() !== "";

/**
 * Returns true when a contract has all required fields filled in.
 */
export const isContractComplete = (c = {}) => {
  if (!c) return false;
  const hasRole = isNonEmpty(c.roleTitle);
  const hasScope = isNonEmpty(c.scopeOfWork) || isNonEmpty(c.explanationOfScopeOfWork);
  const hasPay = isNonEmpty(c.paymentRate) || isNonEmpty(c.minimumToPayToTalent);
  const hasStart = isNonEmpty(c.startDate);
  return hasRole && hasScope && hasPay && hasStart;
};

/**
 * Returns true when at least one assigned talentId maps to a real developer
 * in the provided knownTalentIds Set.
 */
export const isContractAssigned = (c = {}, knownTalentIds = new Set()) => {
  const ids = getAssignedTalentIds(c);
  if (ids.length === 0) return false;
  return ids.some((id) => knownTalentIds.has(String(id)));
};

export default function AssignmentPage() {
  const [contracts, setContracts] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState("completed"); // pending | assigned | completed
  const [selectedContract, setSelectedContract] = useState(null);
  const [assigningContract, setAssigningContract] = useState(null);
  const [selectedTalentId, setSelectedTalentId] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [notice, setNotice] = useState(null); // { type, text }
  const [searchDev, setSearchDev] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  // Close modals on Escape
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

  async function loadAll(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

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
        return dateB - dateA;
      });

      setContracts(sortedContracts);
      setDevelopers(norm(devsRes));
    } catch (err) {
      console.error("Error loading assignment data:", err);
      setContracts([]);
      setDevelopers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // ─── Build a Set of ALL known developer IDs (talentId, _id, id) ──────────────
  // This is the ground-truth for "is this assignment real?"
  const knownTalentIds = useMemo(() => {
    const s = new Set();
    developers.forEach((d) => {
      if (d.talentId) s.add(String(d.talentId));
      if (d._id) s.add(String(d._id));
      if (d.id) s.add(String(d.id));
    });
    return s;
  }, [developers]);

  // ─── Contract classification ──────────────────────────────────────────────────
  //
  //  ASSIGNED  : complete + has at least one valid talent from the system
  //  COMPLETED : complete + NOT assigned yet (ready to be assigned)
  //  PENDING   : incomplete (missing required fields)
  //
  // Priority: ASSIGNED > COMPLETED > PENDING
  // A contract cannot appear in more than one tab.
  // ─────────────────────────────────────────────────────────────────────────────

  const { pendingContracts, completedContracts, assignedContracts } = useMemo(() => {
    const pending = [];
    const completed = [];
    const assigned = [];

    contracts.forEach((c) => {
      const complete = isContractComplete(c);
      const assignedToRealDev = isContractAssigned(c, knownTalentIds);

      if (!complete) {
        // Incomplete form → Pending. Cannot be assigned.
        pending.push(c);
      } else if (assignedToRealDev) {
        // Complete + has a real developer assigned → Assigned tab
        assigned.push(c);
      } else {
        // Complete but no developer yet → Ready to assign (Completed tab)
        completed.push(c);
      }
    });

    return {
      pendingContracts: pending,
      completedContracts: completed,
      assignedContracts: assigned,
    };
  }, [contracts, knownTalentIds]);

  // ─── Talent / developer helpers ───────────────────────────────────────────────

  const talentMap = useMemo(() => {
    const m = new Map();
    developers.forEach((d) => {
      if (d._id) m.set(String(d._id), d);
      if (d.talentId) m.set(String(d.talentId), d);
      if (d.id) m.set(String(d.id), d);
    });
    return m;
  }, [developers]);

  const assignedCountById = useMemo(() => {
    const m = new Map();
    contracts.forEach((c) => {
      // Only count assignments that are real (resolve to a known developer)
      getAssignedTalentIds(c).forEach((id) => {
        if (!id || !knownTalentIds.has(String(id))) return;
        const k = String(id);
        m.set(k, (m.get(k) || 0) + 1);
      });
    });
    return m;
  }, [contracts, knownTalentIds]);

  const getDeveloperIdVariants = (d) => {
    if (!d) return [];
    const ids = [];
    if (d._id) ids.push(String(d._id));
    if (d.talentId) ids.push(String(d.talentId));
    if (d.id) ids.push(String(d.id));
    return [...new Set(ids)];
  };

  const getAssignedCountForDeveloper = (d) => {
    const ids = getDeveloperIdVariants(d);
    let sum = 0;
    ids.forEach((id) => {
      sum += assignedCountById.get(String(id)) || 0;
    });
    return sum;
  };

  const getAssignedDevelopersForContract = (contract) => {
    const ids = getAssignedTalentIds(contract);
    // Only return developers that actually exist in the system
    return ids
      .map((id) => talentMap.get(String(id)))
      .filter(Boolean);
  };

  // ─── Display helpers ──────────────────────────────────────────────────────────

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

  // ─── Developer scoring & sorting ─────────────────────────────────────────────

  const scoreDeveloperForContract = (dev = {}, contract = {}) => {
    let score = 0;
    const devText =
      `${dev.roleTitle || ""} ${dev.experienceLevel || ""} ${
        dev.skills ? dev.skills.join(" ") : ""
      }`.toLowerCase();
    const hireText =
      `${contract.roleTitle || contract.YourTitle || ""} ${
        contract.scopeOfWork || contract.explanationOfScopeOfWork || ""
      } ${contract.wantTalentAs || ""}`.toLowerCase();

    const hireWords = Array.from(
      new Set(hireText.split(/\W+/).filter(Boolean).slice(0, 30))
    );
    hireWords.forEach((w) => {
      if (w.length > 2 && devText.includes(w)) score += 2;
    });

    const devExp = (dev.experienceLevel || "").toLowerCase();
    const hireSen = (contract.seniorityLevel || "").toLowerCase();
    if (devExp && hireSen && devExp === hireSen) score += 3;
    if (
      devExp.includes("senior") &&
      (hireSen.includes("mid") || hireSen.includes("junior"))
    )
      score += 1;

    return score;
  };

  const sortedDevelopersForAssign = useMemo(() => {
    if (!assigningContract) return developers.slice();
    return developers
      .map((d) => ({
        dev: d,
        assignedCount: getAssignedCountForDeveloper(d),
        __score: scoreDeveloperForContract(d, assigningContract),
      }))
      .sort((a, b) => {
        if ((a.assignedCount === 0) !== (b.assignedCount === 0))
          return a.assignedCount === 0 ? -1 : 1;
        if (b.__score !== a.__score) return b.__score - a.__score;
        const na = getDevDisplayName(a.dev).toLowerCase();
        const nb = getDevDisplayName(b.dev).toLowerCase();
        return na < nb ? -1 : na > nb ? 1 : 0;
      })
      .map((x) => x.dev);
  }, [developers, assigningContract, contracts, assignedCountById]);

  // ─── Assignment flow ──────────────────────────────────────────────────────────

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
    if (!assigningContract)
      return setNotice({ type: "error", text: "No contract selected." });
    if (!selectedTalentId)
      return setNotice({ type: "error", text: "Please select a developer first." });

    setAssigning(true);
    setNotice(null);

    try {
      const talentIds = Array.isArray(selectedTalentId)
        ? selectedTalentId
        : [selectedTalentId];
      const contractId =
        assigningContract._id || assigningContract.contractId || assigningContract.id;

      const res = await assignDeveloper(talentIds, contractId);
      const success =
        res?.ok ||
        res?.status === "success" ||
        (res?.data && !res.data.error) ||
        res?.status === 200;

      if (!success) {
        setNotice({
          type: "error",
          text: res?.error || res?.message || "Assignment failed.",
        });
        return;
      }

      // Optimistic update — merge new talent IDs and mark status as "assigned"
      setContracts((prev) =>
        prev.map((c) => {
          const id = c._id || c.contractId || c.id;
          if (!id || String(id) !== String(contractId)) return c;
          const existing = getAssignedTalentIds(c);
          const combined = Array.from(
            new Set([...existing.map(String), ...talentIds.map(String)])
          );
          return { ...c, talentAssignedId: combined, talentIds: combined, status: "assigned" };
        })
      );

      setNotice({ type: "success", text: "Developer assigned successfully!" });
      closeAssignModal();

      // Background sync to get fresh data from server
      await loadAll(true);
    } catch (err) {
      console.error("Assign error:", err);
      setNotice({
        type: "error",
        text: err?.message || "An error occurred while assigning.",
      });
    } finally {
      setAssigning(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  // ─── Tabs config ──────────────────────────────────────────────────────────────

  const tabs = [
    {
      key: "pending",
      label: "Pending",
      count: pendingContracts.length,
      icon: Clock,
      description:
        "Incomplete contracts — missing required fields (role, scope, pay, or start date). Cannot be assigned until the client completes the form.",
      emptyMessage: "No incomplete contracts. All contracts have been fully filled out.",
    },
    {
      key: "completed",
      label: "Ready to Assign",
      count: completedContracts.length,
      icon: FileText,
      description: "Fully completed contracts waiting for a developer to be assigned.",
      emptyMessage: "No contracts are ready to be assigned right now.",
    },
    {
      key: "assigned",
      label: "Assigned",
      count: assignedContracts.length,
      icon: CheckCircle,
      description: "Contracts that have at least one developer assigned from the talent pool.",
      emptyMessage: "No contracts have been assigned yet.",
    },
  ];

  const activeTabConfig = tabs.find((t) => t.key === activeTab);
  const visibleContracts =
    activeTab === "pending"
      ? pendingContracts
      : activeTab === "assigned"
      ? assignedContracts
      : completedContracts;

  // ─── Loading state ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <AdminLayout title="Assignment Manager">
        <div className="p-10 text-center text-gray-500 animate-pulse">
          Loading assignment data...
        </div>
      </AdminLayout>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Assignment Manager">
      {/* Notice */}
      {notice && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
            notice.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{notice.text}</span>
          <button
            onClick={() => setNotice(null)}
            className="ml-4 text-current opacity-60 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.key
                    ? "bg-black text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === t.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {contracts.length} contracts · {developers.length} developers
          </span>
          <button
            onClick={() => loadAll(true)}
            disabled={refreshing}
            title="Refresh"
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-40"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tab description */}
      {activeTabConfig && (
        <p className="text-xs text-gray-400 mb-4">{activeTabConfig.description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Contract list */}
        <div className="lg:col-span-2 space-y-4">
          {visibleContracts.length === 0 ? (
            <div className="bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{activeTabConfig?.emptyMessage}</p>
            </div>
          ) : (
            visibleContracts.map((contract) => {
              const assignedList = getAssignedDevelopersForContract(contract);
              const isPending = activeTab === "pending";

              // Derive a display status label based on our classification
              const statusLabel = isPending
                ? "incomplete"
                : assignedList.length > 0
                ? "assigned"
                : "ready";

              const statusColors = {
                incomplete: "bg-yellow-100 text-yellow-700",
                assigned: "bg-blue-100 text-blue-700",
                ready: "bg-emerald-100 text-emerald-700",
              };

              return (
                <div
                  key={contract._id || contract.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-base font-semibold text-black truncate">
                          {contract.roleTitle ||
                            contract.YourTitle ||
                            contract.contractName ||
                            "Untitled Contract"}
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[statusLabel]}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        {contract.clientName || contract.name || "Unknown client"}
                        {(contract.country || contract.state || contract.whereYouLive) && (
                          <span className="ml-1">
                            ·{" "}
                            {contract.country ||
                              contract.state ||
                              contract.whereYouLive}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-gray-400">
                        Budget:{" "}
                        {formatCurrency(
                          contract.minimumToPayToTalent || contract.paymentRate
                        )}
                        {contract.paymentFrequency && (
                          <span className="ml-1">· {contract.paymentFrequency}</span>
                        )}
                      </div>

                      {/* Show which fields are missing for pending contracts */}
                      {isPending && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {!isNonEmpty(contract.roleTitle) && (
                            <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                              Missing: role title
                            </span>
                          )}
                          {!isNonEmpty(contract.scopeOfWork) &&
                            !isNonEmpty(contract.explanationOfScopeOfWork) && (
                              <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                                Missing: scope of work
                              </span>
                            )}
                          {!isNonEmpty(contract.paymentRate) &&
                            !isNonEmpty(contract.minimumToPayToTalent) && (
                              <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                                Missing: payment rate
                              </span>
                            )}
                          {!isNonEmpty(contract.startDate) && (
                            <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                              Missing: start date
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <div className="text-xs text-gray-400">
                        {formatDate(contract.createdAt)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          title="View details"
                          onClick={() => setSelectedContract(contract)}
                          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Assign button is DISABLED for pending/incomplete contracts */}
                        <button
                          onClick={() => !isPending && openAssignModal(contract)}
                          disabled={isPending}
                          title={
                            isPending
                              ? "Cannot assign: contract is incomplete"
                              : assignedList.length > 0
                              ? "Add another developer"
                              : "Assign a developer"
                          }
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            isPending
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800"
                          }`}
                        >
                          {isPending
                            ? "Incomplete"
                            : assignedList.length > 0
                            ? "Re-assign"
                            : "Assign"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Show assigned developers (completed + assigned tabs) */}
                  {assignedList.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-400 mb-1.5">
                        Assigned Developers ({assignedList.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {assignedList.map((t) => (
                          <span
                            key={t._id || t.id || t.talentId}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
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
          {/* Talent pool */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-black flex items-center gap-2">
                <Users className="h-4 w-4" /> Talent Pool
              </h4>
              <div className="text-xs text-gray-400">{developers.length} total</div>
            </div>

            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {developers.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-4">
                  No developers found.
                </div>
              )}
              {developers.map((d) => {
                const assignedCount = getAssignedCountForDeveloper(d);
                const busy = assignedCount > 0;
                return (
                  <div
                    key={d._id || d.talentId || d.id}
                    className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-black truncate">
                        {getDevDisplayName(d)}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {d.roleTitle || d.experienceLevel || "—"}
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          busy
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {busy ? `${assignedCount} active` : "Free"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Summary
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                {
                  label: "Pending",
                  value: pendingContracts.length,
                  color: "text-yellow-600",
                },
                {
                  label: "Ready",
                  value: completedContracts.length,
                  color: "text-blue-600",
                },
                {
                  label: "Assigned",
                  value: assignedContracts.length,
                  color: "text-emerald-600",
                },
              ].map((s) => (
                <div key={s.label} className="p-2 rounded-lg bg-gray-50">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── VIEW CONTRACT MODAL ───────────────────────────────────────── */}
      {selectedContract && (() => {
        const isPendingContract = !isContractComplete(selectedContract);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedContract(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    {selectedContract.roleTitle ||
                      selectedContract.YourTitle ||
                      "Contract Details"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedContract.clientName || selectedContract.name || ""}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-medium ${
                      isPendingContract
                        ? "bg-yellow-100 text-yellow-700"
                        : isContractAssigned(selectedContract, knownTalentIds)
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {isPendingContract
                      ? "incomplete"
                      : isContractAssigned(selectedContract, knownTalentIds)
                      ? "assigned"
                      : "ready to assign"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <hr className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
                <div className="space-y-4">
                  {[
                    {
                      label: "Contact",
                      value: selectedContract.email || "Not provided",
                    },
                    {
                      label: "Company",
                      value: selectedContract.companyName || "Not provided",
                    },
                    {
                      label: "Location",
                      value:
                        selectedContract.country ||
                        selectedContract.state ||
                        selectedContract.whereYouLive ||
                        "Not provided",
                    },
                    {
                      label: "Payment",
                      value: `${formatCurrency(
                        selectedContract.minimumToPayToTalent ||
                          selectedContract.paymentRate
                      )}${
                        selectedContract.paymentFrequency
                          ? " · " + selectedContract.paymentFrequency
                          : ""
                      }`,
                    },
                    {
                      label: "Start Date",
                      value: formatDate(selectedContract.startDate),
                    },
                    {
                      label: "End Date",
                      value: formatDate(selectedContract.endDate),
                    },
                    {
                      label: "Contract Type",
                      value: selectedContract.contractType || "Not provided",
                    },
                    {
                      label: "Seniority",
                      value: selectedContract.seniorityLevel || "Not provided",
                    },
                    {
                      label: "Created",
                      value: formatDate(selectedContract.createdAt),
                    },
                  ].map((f) => (
                    <div key={f.label}>
                      <div className="text-xs text-gray-400 mb-0.5">{f.label}</div>
                      <div className="font-medium">{f.value}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Scope of Work</div>
                    <div className="font-medium whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedContract.explanationOfScopeOfWork ||
                        selectedContract.scopeOfWork ||
                        "Not provided"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1.5">
                      Assigned Developers
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getAssignedDevelopersForContract(selectedContract).length === 0 ? (
                        <span className="text-xs text-gray-400">None assigned yet</span>
                      ) : (
                        getAssignedDevelopersForContract(selectedContract).map((t) => (
                          <span
                            key={t._id || t.id || t.talentId}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {getDevDisplayName(t)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedContract(null)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                >
                  Close
                </button>
                {/* Only show Assign button for complete contracts */}
                {!isPendingContract && (
                  <button
                    onClick={() => {
                      setSelectedContract(null);
                      openAssignModal(selectedContract);
                    }}
                    className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800"
                  >
                    {isContractAssigned(selectedContract, knownTalentIds)
                      ? "Add Developer"
                      : "Assign Developer"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── ASSIGN MODAL ─────────────────────────────────────────────── */}
      {assigningContract && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => closeAssignModal()}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-black">
                  {assigningContract.roleTitle ||
                    assigningContract.YourTitle ||
                    "Assign Developer"}
                </h3>
                <div className="text-xs text-gray-400 mt-0.5">
                  Client:{" "}
                  {assigningContract.clientName ||
                    assigningContract.name ||
                    "Unknown"}
                </div>
                {/* Show already-assigned developers */}
                {getAssignedDevelopersForContract(assigningContract).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-gray-400 mr-1">Currently assigned:</span>
                    {getAssignedDevelopersForContract(assigningContract).map((t) => (
                      <span
                        key={t._id || t.talentId}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                      >
                        {getDevDisplayName(t)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => closeAssignModal()}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <hr className="my-4" />

            <input
              value={searchDev}
              onChange={(e) => setSearchDev(e.target.value)}
              placeholder="Search by name, role, or experience level..."
              className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-black/10"
            />

            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
              {sortedDevelopersForAssign
                .filter((d) => {
                  const q = searchDev.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    getDevDisplayName(d) +
                    " " +
                    (d.roleTitle || "") +
                    " " +
                    (d.experienceLevel || "")
                  )
                    .toLowerCase()
                    .includes(q);
                })
                .map((d) => {
                  const talentId = d.talentId || d._id || d.id;
                  const assignedCount = getAssignedCountForDeveloper(d);
                  const isBusy = assignedCount > 0;
                  const isSelected = selectedTalentId === talentId;

                  // Check if this developer is already on this contract
                  const alreadyOnContract = getAssignedTalentIds(
                    assigningContract
                  ).some((id) =>
                    getDeveloperIdVariants(d).includes(String(id))
                  );

                  return (
                    <label
                      key={talentId}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        alreadyOnContract
                          ? "border-blue-200 bg-blue-50 opacity-70"
                          : isSelected
                          ? "border-black bg-gray-50"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedTalent"
                        value={talentId}
                        checked={isSelected}
                        onChange={() => setSelectedTalentId(talentId)}
                        className="accent-black"
                        disabled={alreadyOnContract}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-black truncate">
                          {getDevDisplayName(d)}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {d.roleTitle || d.experienceLevel || "—"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {alreadyOnContract && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            On contract
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            isBusy
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isBusy ? `${assignedCount} active` : "Free"}
                        </span>
                      </div>
                    </label>
                  );
                })}

              {sortedDevelopersForAssign.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-6">
                  No developers found.
                </div>
              )}
            </div>

            {/* Busy warning */}
            {selectedTalentId &&
              (() => {
                const dev = developers.find((d) =>
                  getDeveloperIdVariants(d).includes(String(selectedTalentId))
                );
                const count = dev ? getAssignedCountForDeveloper(dev) : 0;
                if (count === 0) return null;
                return (
                  <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                    This developer has <strong>{count}</strong> active contract
                    {count > 1 ? "s" : ""}. You can still assign them, but confirm
                    before proceeding.
                  </div>
                );
              })()}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => closeAssignModal()}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={performAssignment}
                disabled={assigning || !selectedTalentId}
                className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {assigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Helper used inside JSX (kept at bottom for readability)
function getDeveloperIdVariants(d) {
  if (!d) return [];
  const ids = [];
  if (d._id) ids.push(String(d._id));
  if (d.talentId) ids.push(String(d.talentId));
  if (d.id) ids.push(String(d.id));
  return [...new Set(ids)];
}