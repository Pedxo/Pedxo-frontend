// src/pages/admin/developers.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import { listDevelopers, listContracts, unassignDeveloper, deleteDeveloper, updateTalentDetails } from "../../utility/adminApi";
import {
  MoreVertical,
  Github,
  Globe,
  MapPin,
  Briefcase,
  X,
  Mail,
  Phone,
    Link as LinkIcon,
  Copy, UserMinus, Trash2, AlertTriangle, Pencil,
  Linkedin, Twitter, Facebook, Instagram, Youtube, Dribbble
} from "lucide-react";

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDev, setSelectedDev] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmUnassign, setConfirmUnassign] = useState(null); // { dev, contract }
  const [editingDev, setEditingDev] = useState(null); // dev object being edited
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null)
  const [performanceRating, setPerformanceRating] = useState("");
  const [terminationReason, setTerminationReason] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);     // dev
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Normalize whatever shape listDevelopers returns into an array
  const normalizeResponse = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
    // some APIs return { error, message, data: [...] }
    if (res.response && res.response.data && Array.isArray(res.response.data)) return res.response.data;
    return [];
  };

  useEffect(() => {
    loadDevelopers();
  }, []);

  // close modal on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectedDev(null);
        setOpenMenuId(null);
        setConfirmUnassign(null);
        setConfirmDelete(null);
        setEditingDev(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loadDevelopers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [devRes, contractRes] = await Promise.all([listDevelopers(), listContracts()]);
      setDevelopers(normalizeResponse(devRes));
      setContracts(Array.isArray(contractRes) ? contractRes : normalizeResponse(contractRes));
    } catch (err) {
      console.error("Error loading developers:", err);
      setError("Could not load developers. Check console / backend.");
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async () => {
    if (!confirmUnassign) return;
    const ratingNum = Number(performanceRating);
    if (!performanceRating || Number.isNaN(ratingNum) || !terminationReason.trim()) {
     setActionError("Please provide a performance rating and a reason.");
     return;
   }
    setActionLoading(true);
    setActionError(null);
    const { dev, contract } = confirmUnassign;
    const res = await unassignDeveloper(dev.talentId, contract._id, ratingNum, terminationReason.trim());
    setActionLoading(false);
    if (res.ok) {
      setConfirmUnassign(null);
      setPerformanceRating("");
      setTerminationReason("");
      await loadDevelopers();
    } else {
      setActionError(res.error || "Failed to unassign talent");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setActionLoading(true);
    setActionError(null);
    const res = await deleteDeveloper(confirmDelete._id);
    setActionLoading(false);
    if (res.ok) {
      setConfirmDelete(null);
      await loadDevelopers();
    } else {
      setActionError(res.error || "Failed to delete talent");
    }
  };
  // Contracts this developer is currently assigned to
  const getAssignedContracts = (dev) => {
    const tid = String(dev?.talentId || "");
    if (!tid) return [];
    return contracts.filter(
      (c) => Array.isArray(c.talentAssignedId) && c.talentAssignedId.map(String).includes(tid)
    );
  };

  const getInitials = (dev) => {
    const f = (dev?.firstName || "").trim();
    const l = (dev?.lastName || "").trim();
    if (f || l) return (f[0] || "") + (l[0] || "");
    if (dev?.name) return dev.name.split(" ").map(p => p[0]).slice(0,2).join("");
    if (dev?.email) return dev.email[0].toUpperCase();
    return "??";
  };

  const SOCIAL_LABELS = {
    linkedinAccount: "LinkedIn",
    gitlabAccount: "GitLab",
    twitterAccount: "Twitter / X",
    facebookAccount: "Facebook",
    instagramAccount: "Instagram",
    tiktokAccount: "TikTok",
    youtubeAccount: "YouTube",
    behanceAccount: "Behance",
    dribbbleAccount: "Dribbble",
    other: "Other",
  };

  const SOCIAL_ICONS = {
    linkedinAccount: Linkedin,
    twitterAccount: Twitter,
    facebookAccount: Facebook,
    instagramAccount: Instagram,
    youtubeAccount: Youtube,
    tiktokAccount: Globe,        // lucide has no tiktok icon, reuse Globe
    gitlabAccount: Github,     // lucide has no gitlab icon, reuse Github
    behanceAccount: Globe,
    dribbbleAccount: Globe,
    other: LinkIcon,
};

const getSocialLinks = (dev) => {
  const sp = dev?.socialProfiles || {};
  return Object.entries(sp).filter(([key, url]) => key !== "_id" && url);
};

  const formatDate = (iso) => {
    if (!iso) return "Not set";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString();
  };

  const getFullName = (dev) =>
    [dev?.firstName, dev?.lastName].filter(Boolean).join(" ") ||
    dev?.name ||
    dev?.email ||
    "Unknown";

  const getTitle = (dev) =>
    dev?.roleTitle ||
    dev?.role ||
    dev?.YourTitle ||
    "Developer";
  
  const openEdit = (dev) => {
    setEditError(null);
    setEditForm({
      firstName: dev?.firstName || "",
      lastName: dev?.lastName || "",
      email: dev?.email || "",
      roleTitle: dev?.roleTitle || "",
      country: dev?.country || "",
      state: dev?.state || "",
      city: dev?.city || "",
      gender: dev?.gender || "",
      bankName: dev?.bankName || "",
      accountNumber: dev?.accountNumber || "",
      experienceLevel: dev?.experienceLevel || "",
      githubAccount: dev?.githubAccount || "",
      portfolioLink: dev?.portfolioLink || "",
      whatsappNumber: dev?.whatsappNumber || "",
      homeAddress: dev?.homeAddress || "",
    });
    setEditingDev(dev);
    setOpenMenuId(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editingDev) return;
    setEditSaving(true);
    setEditError(null);
    // strip empty strings so we don't overwrite existing values with blanks
    const payload = Object.fromEntries(
      Object.entries(editForm).filter(([, v]) => v !== "")
    );
    const talentDetailsId = editingDev._id || editingDev.talentId;
    const res = await updateTalentDetails(talentDetailsId, payload);
    setEditSaving(false);
    if (res.ok) {
      setEditingDev(null);
      await loadDevelopers();
    } else {
      setEditError(res.error || "Failed to update talent");
    }
  };

  const getLocation = (dev) =>
    [dev?.city, dev?.state || dev?.region, dev?.country].filter(Boolean).join(", ") ||
    dev?.whereYouLive ||
    "Unknown";

  // simple search across common fields
  const filtered = developers.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (getFullName(d) || "").toLowerCase().includes(q) ||
      (d?.email || "").toLowerCase().includes(q) ||
      (getTitle(d) || "").toLowerCase().includes(q) ||
      (getLocation(d) || "").toLowerCase().includes(q)
    );
  });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // tiny visual cue would be nice — for now console.log
      console.log("copied:", text);
    } catch (e) {
      console.warn("clipboard failed", e);
    }
  };

  return (
    <AdminLayout title={`Developer Pool (${developers.length})`}>
      {/* top row: search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <input
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Search developers by name, email, role or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-600">{developers.length} total</div>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading developers…</div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-100 rounded text-red-700">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No developers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dev, idx) => (
            <div key={dev._id || dev.talentId || dev.id || idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-black rounded-full grid place-items-center text-white font-medium text-sm">
                    {getInitials(dev)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{getFullName(dev)}</h3>
                    <div className="text-xs text-gray-600 mt-1">{getTitle(dev)}</div>
                  </div>
                </div>
                {(() => {
  const assignedContracts = getAssignedContracts(dev);
  const isAssigned = assignedContracts.length > 0;
  const menuOpen = openMenuId === (dev._id || dev.talentId || idx);
  const menuKey = dev._id || dev.talentId || idx;

  return (
    <div className="relative">
      <button
        className="p-1 hover:bg-gray-100 rounded-md"
        aria-label="more"
        onClick={() => setOpenMenuId(menuOpen ? null : menuKey)}
      >
        <MoreVertical className="h-4 w-4 text-gray-600" />
      </button>

      {menuOpen && (
        <>
          {/* click-away backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
          <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            {isAssigned ? (
              <div className="px-3 py-2">
                <div className="text-xs text-gray-500 mb-1">Unassign from:</div>
                {assignedContracts.map((c) => (
                  <button
                    key={c._id}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                    onClick={() => {
                      setOpenMenuId(null);
                      setActionError(null);
                      setConfirmUnassign({ dev, contract: c });
                    }}
                  >
                    <UserMinus className="h-3.5 w-3.5 text-gray-500" />
                    <span className="truncate">{c.companyName || c.clientName || c._id}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-xs text-gray-400">Not assigned to any contract</div>
            )}

            <hr className="my-1" />

            <button
              className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50"
              onClick={() => openEdit(dev)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit talent
            </button>

            <button
              disabled={isAssigned}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                isAssigned ? "text-gray-300 cursor-not-allowed" : "text-red-600 hover:bg-red-50"
              }`}
              title={isAssigned ? "Unassign from all contracts before deleting" : "Delete talent"}
              onClick={() => {
                if (isAssigned) return;
                setOpenMenuId(null);
                setActionError(null);
                setConfirmDelete(dev);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete talent
            </button>
          </div>
        </>
      )}
    </div>
  );
})()}
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{getTitle(dev)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{getLocation(dev)}</span>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a className="underline" href={`mailto:${dev?.email || ""}`}>{dev?.email || "No email"}</a>
                    {dev?.email && (
                      <button className="ml-2 text-xs" onClick={() => copyToClipboard(dev.email)} title="Copy email">
                        <Copy className="h-4 w-4 inline-block" />
                      </button>
                    )}
                  </div>
                  {dev?.whatsappNumber && (
                    <div className="text-xs mt-1 flex items-center gap-2">
                      <Phone className="h-3 w-3" /> WhatsApp: <a href={`https://wa.me/${dev.whatsappNumber.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="underline">{dev.whatsappNumber}</a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  {dev?.githubAccount && (
                    <a href={dev.githubAccount} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                      <Github className="h-4 w-4 text-gray-700" />
                    </a>
                  )}
                  {dev?.portfolioLink && (
                    <a href={dev.portfolioLink} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                      <Globe className="h-4 w-4 text-gray-700" />
                    </a>
                  )}
                  {dev?.website && (
                    <a href={dev.website} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                      <LinkIcon className="h-4 w-4 text-gray-700" />
                    </a>
                  )}
                </div>

                <div className="text-sm text-gray-800 mt-2">
                  <div>
                    <span className="text-xs text-gray-500">Title</span>
                    <div className="font-medium">{getTitle(dev)}</div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Joined</div>
                  <div className="text-sm">{formatDate(dev?.createdAt)}</div>
                </div>

                <button
                  onClick={() => setSelectedDev(dev)}
                  className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UNASSIGN CONFIRM */}
{confirmUnassign && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !actionLoading && setConfirmUnassign(null)}>
    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2 text-amber-600 mb-2">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-semibold">Unassign talent?</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Unassign <strong>{getFullName(confirmUnassign.dev)}</strong> from{" "}
        <strong>{confirmUnassign.contract.companyName || confirmUnassign.contract.clientName}</strong>?
      </p>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Performance rating (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={performanceRating}
            onChange={(e) => setPerformanceRating(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Termination reason</label>
          <textarea
            value={terminationReason}
            onChange={(e) => setTerminationReason(e.target.value)}
            rows="3"
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>
      </div>
      {actionError && <p className="text-sm text-red-600 mb-3">{actionError}</p>}
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 rounded border border-gray-300" onClick={() => setConfirmUnassign(null)} disabled={actionLoading}>
          Cancel
        </button>
        <button className="px-4 py-2 rounded bg-black text-white disabled:opacity-50" onClick={handleUnassign} disabled={actionLoading}>
          {actionLoading ? "Unassigning…" : "Unassign"}
        </button>
      </div>
    </div>
  </div>
)}

{/* DELETE CONFIRM */}
{confirmDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !actionLoading && setConfirmDelete(null)}>
    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2 text-red-600 mb-2">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-semibold">Delete talent?</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        This permanently deletes <strong>{getFullName(confirmDelete)}</strong>. This can't be undone.
      </p>
      {actionError && <p className="text-sm text-red-600 mb-3">{actionError}</p>}
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 rounded border border-gray-300" onClick={() => setConfirmDelete(null)} disabled={actionLoading}>
          Cancel
        </button>
        <button className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50" onClick={handleDelete} disabled={actionLoading}>
          {actionLoading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* EDIT TALENT MODAL */}
{editingDev && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => !editSaving && setEditingDev(null)}
  >
    <div
      className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold">Edit {getFullName(editingDev)}</h3>
        <button className="p-2 rounded hover:bg-gray-100" onClick={() => setEditingDev(null)}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {editError && <p className="text-sm text-red-600 mb-3">{editError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ["firstName", "First Name"],
          ["lastName", "Last Name"],
          ["email", "Email"],
          ["roleTitle", "Role Title"],
          ["country", "Country"],
          ["state", "State"],
          ["city", "City"],
          ["gender", "Gender"],
          ["bankName", "Bank Name"],
          ["accountNumber", "Account Number"],
          ["experienceLevel", "Experience Level"],
          ["githubAccount", "GitHub Account"],
          ["portfolioLink", "Portfolio Link"],
          ["whatsappNumber", "WhatsApp Number"],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input
              className="w-full border px-3 py-2 rounded text-sm"
              value={editForm[field] || ""}
              onChange={(e) => handleEditChange(field, e.target.value)}
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500 block mb-1">Home Address</label>
          <textarea
            className="w-full border px-3 py-2 rounded text-sm"
            rows="2"
            value={editForm.homeAddress || ""}
            onChange={(e) => handleEditChange("homeAddress", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          className="px-4 py-2 rounded border"
          onClick={() => setEditingDev(null)}
          disabled={editSaving}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          onClick={handleEditSave}
          disabled={editSaving}
        >
          {editSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* VIEW MODAL */}
      {selectedDev && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedDev(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black">{getFullName(selectedDev)}</h2>
                <p className="text-sm text-gray-600">{getTitle(selectedDev)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded hover:bg-gray-100" onClick={() => setSelectedDev(null)} aria-label="close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <hr className="my-4" />

            {/* body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Contact</div>
                  <div className="font-medium">{selectedDev?.email || "Not provided"}</div>
                  {selectedDev?.whatsappNumber && <div className="text-xs text-gray-500">WhatsApp: {selectedDev.whatsappNumber}</div>}
                </div>

                <div>
                  <div className="text-xs text-gray-500">Location</div>
                    <div className="font-medium">{(selectedDev?.whereYouLive || getLocation(selectedDev)) || "Not set"}</div>
                    {(selectedDev?.city || selectedDev?.state || selectedDev?.country) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {[selectedDev?.city, selectedDev?.state, selectedDev?.country].filter(Boolean).join(" · ")}
                      </div>
                    )}
                </div>

                <div>
                  <div className="text-xs text-gray-500">Home Address</div>
                  <div className="font-medium">{selectedDev?.homeAddress || "Not provided"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Gender</div>
                  <div className="font-medium">{selectedDev?.gender || "Not set"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Date of Birth</div>
                  <div className="font-medium">{formatDate(selectedDev?.dateOfBirth)}</div>
                </div>


                <div>
                  <div className="text-xs text-gray-500">Title / Role</div>
                  <div className="font-medium">{getTitle(selectedDev)}</div>
                </div>


                <div>
                  <div className="text-xs text-gray-500">Seniority / Experience</div>
                  <div className="font-medium">{selectedDev?.experienceLevel || selectedDev?.seniorityLevel || "Not set"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Links</div>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedDev?.githubAccount && <a className="px-2 py-1 bg-gray-100 rounded" href={selectedDev.githubAccount} target="_blank" rel="noreferrer"><Github className="h-4 w-4" /></a>}
                    {selectedDev?.portfolioLink && <a className="px-2 py-1 bg-gray-100 rounded" href={selectedDev.portfolioLink} target="_blank" rel="noreferrer"><Globe className="h-4 w-4" /></a>}
                    {selectedDev?.website && <a className="px-2 py-1 bg-gray-100 rounded" href={selectedDev.website} target="_blank" rel="noreferrer"><LinkIcon className="h-4 w-4" /></a>}
                  </div>
                </div>

                {selectedDev?.bankName && (
                  <div>
                    <div className="text-xs text-gray-500">Bank</div>
                    <div className="font-medium">{selectedDev.bankName} — {selectedDev.accountNumber || "No account number"}</div>
                  </div>
                )}

                {selectedDev?.skills && Array.isArray(selectedDev.skills) && (
                  <div>
                    <div className="text-xs text-gray-500">Skills</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedDev.skills.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              

              {/* right column */}
              <div className="space-y-3">

                {getSocialLinks(selectedDev).length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Social Profiles</div>
                      <div className="flex flex-wrap gap-2">
                          {getSocialLinks(selectedDev).map(([key, url]) => {
                            const Icon = SOCIAL_ICONS[key] || LinkIcon;
                            const label = SOCIAL_LABELS[key] || key;
                            return (
                              <a
                                key={key}
                                href={url.startsWith("http") ? url : `https://${url}`}
                                target="_blank"
                                rel="noreferrer"
                                title={url}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors"
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                              </a>
                            );
                          })}
                      </div>
                  </div>
                )}

                {selectedDev?.haveYouBuildSomePart && (
                  <div>
                    <div className="text-xs text-gray-500">Built before?</div>
                    <div className="font-medium">{selectedDev.haveYouBuildSomePart}</div>
                  </div>
                )}

                {selectedDev?.wantTalentAs && (
                  <div>
                    <div className="text-xs text-gray-500">Want talent as</div>
                    <div className="font-medium">{selectedDev.wantTalentAs}</div>
                  </div>
                )}

                {selectedDev?.paymentPattern && (
                  <div>
                    <div className="text-xs text-gray-500">Payment pattern</div>
                    <div className="font-medium">{selectedDev.paymentPattern}</div>
                  </div>
                )}

                {selectedDev?.minimumToPayToTalent && (
                  <div>
                    <div className="text-xs text-gray-500">Min pay to talent</div>
                    <div className="font-medium">{selectedDev.minimumToPayToTalent}</div>
                  </div>
                )}

                {selectedDev?.talentAssignedId && Array.isArray(selectedDev.talentAssignedId) && (
                  <div>
                    <div className="text-xs text-gray-500">Assigned talent IDs</div>
                    <div className="font-medium">{selectedDev.talentAssignedId.join(", ")}</div>
                  </div>
                )}

                {selectedDev?.contractId && (
                  <div>
                    <div className="text-xs text-gray-500">Contract ID</div>
                    <div className="font-medium">{selectedDev.contractId}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-gray-500">Created / Updated</div>
                  <div className="font-medium">{formatDate(selectedDev.createdAt)} — {formatDate(selectedDev.updatedAt)}</div>
                </div>

                {selectedDev?.bio && (
                  <div>
                    <div className="text-xs text-gray-500">Bio</div>
                    <div className="font-medium whitespace-pre-wrap">{selectedDev.bio}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedDev(null)} className="px-4 py-2 rounded bg-black text-white hover:bg-gray-900">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
