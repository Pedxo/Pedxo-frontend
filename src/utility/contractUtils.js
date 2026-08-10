// src/utility/contractUtils.js

/**
 * Shared contract utilities used across dashboard / assignment pages
 * - getAssignedTalentIds(contract): returns array of assigned talent ids (strings)
 * - isContractCompleted(contract): boolean for completed status
 * - getContractTime(contract): numeric timestamp (ms) for recency sorting
 * - getContractAmount(contract): numeric amount (or 0)
 */

export const getAssignedTalentIds = (contract = {}) => {
  const v = contract?.talentAssignedId;

  if (!v) return [];

  if (Array.isArray(v)) {
    return v.map(String);
  }

  return [String(v)];
};


export const isContractCompleted = (c) => c.status === "completed";

export const getContractTime = (c = {}) => {
  const candidates = [c.updatedAt, c.createdAt, c.startDate, c.created_at, c.updated_at];
  for (const t of candidates) {
    if (!t && t !== 0) continue;
    const parsed = Date.parse(t);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
};

export const getContractAmount = (c = {}) => {
  const candidates = [
    c.paymentRate,
    c.payment_rate,
    c.minimumToPayToTalent,
    c.paymentAmount,
    c.payment,
    c.payment_rate_amount,
  ];
  for (const x of candidates) {
    if (x === undefined || x === null || x === "") continue;
    const n = Number(x);
    if (!Number.isNaN(n)) return n;
  }
  return 0;
};


export const getContractStatus = (contract) => {
  if (!contract) return "pending";

  // 1. Assigned takes priority — source of truth is talentAssignedId, not the raw status field.
  const assignedIds = getAssignedTalentIds(contract);
  if (assignedIds.length > 0) return "assigned";

  // 2. Not assigned — route by whether the admin has enough info to assign it.
  if (!isContractDataComplete(contract)) return "pending";

  // 3. Fully filled, no dev yet.
  return "completed";
};

// Fields that actually exist on the Contract schema and matter for "is this data complete enough to assign".
// roleTitle is intentionally excluded — it's optional for every contract type, including full-time,
// per the JobDetailsDto and FormTwo.jsx validation (only required when contractType === 'gig-based').
const REQUIRED_CONTRACT_FIELDS = [
  { key: "clientName", label: "Client Name" },
  { key: "email", label: "Email" },
  { key: "country", label: "Country" },
  { key: "startDate", label: "Start Date" },
  { key: "paymentRate", label: "Payment Rate" },
  { key: "paymentFrequency", label: "Payment Frequency" },
];

export const getMissingContractFields = (c = {}) => {
  const missing = REQUIRED_CONTRACT_FIELDS
    .filter(({ key }) => c[key] === undefined || c[key] === null || c[key] === "")
    .map(({ label }) => label);

  if (!c.scopeOfWork && !c.explanationOfScopeOfWork) {
    missing.push("Scope of Work");
  }

  return missing;
};

export const isContractDataComplete = (c = {}) => getMissingContractFields(c).length === 0;