import { getAssignedTalentIds } from "./contractUtils.js";

const isNonEmpty = (v) =>
  v !== null && v !== undefined && String(v).trim() !== "";

// ✅ SAME logic from assignment.jsx
export const isContractComplete = (c = {}) => {
  if (!c) return false;

  const hasRole = isNonEmpty(c.roleTitle);
  const hasScope =
    isNonEmpty(c.scopeOfWork) || isNonEmpty(c.explanationOfScopeOfWork);
  const hasPay =
    isNonEmpty(c.paymentRate) ||
    isNonEmpty(c.minimumToPayToTalent);
  const hasStart = isNonEmpty(c.startDate);

  return hasRole && hasScope && hasPay && hasStart;
};

export const isContractAssigned = (c = {}, knownTalentIds = new Set()) => {
  const ids = getAssignedTalentIds(c);
  if (ids.length === 0) return false;

  return ids.some((id) => knownTalentIds.has(String(id)));
};

// 🔥 One unified function (this is the key)
export const classifyContract = (c, knownTalentIds) => {
  const complete = isContractComplete(c);
  const assigned = isContractAssigned(c, knownTalentIds);

  if (!complete) return "pending";
  if (assigned) return "assigned";
  return "ready";
};