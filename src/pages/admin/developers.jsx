// src/pages/admin/developers.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import { listDevelopers } from "../../utility/adminApi";
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
  Copy
} from "lucide-react";

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDev, setSelectedDev] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

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
    const onKey = (e) => e.key === "Escape" && setSelectedDev(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loadDevelopers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listDevelopers();
      const arr = normalizeResponse(res);
      setDevelopers(arr);
    } catch (err) {
      console.error("Error loading developers:", err);
      setError("Could not load developers. Check console / backend.");
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (dev) => {
    const f = (dev?.firstName || "").trim();
    const l = (dev?.lastName || "").trim();
    if (f || l) return (f[0] || "") + (l[0] || "");
    if (dev?.name) return dev.name.split(" ").map(p => p[0]).slice(0,2).join("");
    if (dev?.email) return dev.email[0].toUpperCase();
    return "??";
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
                <button className="p-1 hover:bg-gray-100 rounded-md" aria-label="more">
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>
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
