// src/utility/contractUtils.js

/**
 * Shared contract utilities used across dashboard / assignment pages
 * - getAssignedTalentIds(contract): returns array of assigned talent ids (strings)
 * - isContractCompleted(contract): boolean for completed status
 * - getContractTime(contract): numeric timestamp (ms) for recency sorting
 * - getContractAmount(contract): numeric amount (or 0)
 */

export const getAssignedTalentIds = (contract = {}) => {
  if (!contract) return [];

  const candidateKeys = [
    "talentAssignedId",
    "talentAssigned",
    "talentIds",
    "talentAssignedIds",
    "assignedTalent",
    "assignedDev",
    "developerId",
    "assignedDeveloper",
    "talentId",
    "talent_assigned",
  ];

  for (const key of candidateKeys) {
    const v = contract[key];
    if (v === undefined || v === null) continue;

    // array
    if (Array.isArray(v)) {
      const out = v.flatMap((item) => {
        if (!item) return [];
        if (typeof item === "string") return [item];
        if (typeof item === "number") return [String(item)];
        if (typeof item === "object") {
          return [item._id ?? item.id ?? item.talentId ?? item.talent_id ?? item.value].filter(Boolean);
        }
        return [];
      });
      if (out.length) return Array.from(new Set(out.map(String)));
    }

    // string or number
    if (typeof v === "string" || typeof v === "number") {
      return [String(v)];
    }

    // single object
    if (typeof v === "object") {
      const id = v._id ?? v.id ?? v.talentId ?? v.talent_id ?? v.value;
      if (id) return [String(id)];
    }
  }

  // nested fallback
  if (contract.hire?.talentAssignedId) return getAssignedTalentIds({ talentAssignedId: contract.hire.talentAssignedId });

  return [];
};

export const isContractCompleted = (c) => {
  if (!c) return false;
  if (c.isCompleted === true) return true;
  const p = (c.progress ?? "").toString().toLowerCase();
  return p.includes("signed") || p.includes("completed") || p.includes("done") || p.includes("closed");
};

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
