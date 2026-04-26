export const getPaymentStatus = (emp, transactions) => {
  if (!emp?.paymentRate) return "due";

  const key = `${emp.contractId}_${emp.talentAssignedId}`;

  const empPayments = transactions.filter((trx) => {
    return (
      trx.type === "payout" &&
      trx.status === "successful" && //REQUIRED
      trx.ini_reference?.includes(`PAY-${key}`)
    );
  });

  if (!empPayments.length) return "due";

  const lastPayment = new Date(
    Math.max(...empPayments.map((trx) => new Date(trx.created_at)))
  );

  const now = new Date();
  const diffDays = (now - lastPayment) / (1000 * 60 * 60 * 24);

  const freq = emp.paymentFrequency?.toLowerCase() || "";

  if (freq.includes("weekly")) return diffDays >= 7 ? "due" : "paid";
  if (freq.includes("bi-weekly")) return diffDays >= 14 ? "due" : "paid";
  if (freq.includes("monthly")) return diffDays >= 30 ? "due" : "paid";

  return "paid"; // fallback changed
};