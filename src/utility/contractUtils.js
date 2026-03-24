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


export const isContractCompleted = (c) => {
  return c?.isCompleted === true;
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
