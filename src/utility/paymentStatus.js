
/*
 * ============================================================
 * PAYMENT FREQUENCY HELPERS
 * ============================================================
 * weekly   -> +7 days
 * biweekly -> +14 days
 * monthly  -> +1 calendar month
 *
 */

export const normalizePaymentFrequency = (frequency) => {
  const freq = String(frequency || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  switch (freq) {
    case "weekly":
      return "weekly";

    case "biweekly":
      return "biweekly";

    case "monthly":
      return "monthly";

    default:
      return "";
  }
};


/*
 * ============================================================
 * CALCULATE NEXT PAYMENT DATE
 * ============================================================
 */

export const calculateNextPaymentDate = (startDate, frequency) => {
  if (!startDate) return null;

  const normalizedFrequency = normalizePaymentFrequency(frequency);

  const date = new Date(startDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  switch (normalizedFrequency) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;

    case "biweekly":
      date.setDate(date.getDate() + 14);
      break;

    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;

    default:
      return null;
  }

  return date;
};


/*
 * ============================================================
 * GET LAST SUCCESSFUL PAYMENT
 * ============================================================
 */

const getLastSuccessfulPayment = (emp, transactions) => {
  if (!emp?.contractId || !emp?.talentAssignedId) {
    return null;
  }

  const key = `${emp.contractId}_${emp.talentAssignedId}`;

  const empPayments = transactions.filter((trx) => {
    return (
      trx.type === "payout" &&
      trx.status === "successful" &&
      trx.ini_reference?.includes(`PAY-${key}`)
    );
  });

  if (!empPayments.length) {
    return null;
  }

  const validDates = empPayments
    .map((trx) => new Date(trx.created_at))
    .filter((date) => !Number.isNaN(date.getTime()));

  if (!validDates.length) {
    return null;
  }

  return new Date(
    Math.max(...validDates.map((date) => date.getTime()))
  );
};


/*
 * ============================================================
 * PAYMENT STATUS
 * ============================================================
 */

export const getPaymentStatus = (emp, transactions = []) => {
  if (!emp?.paymentRate) {
    return "due";
  }

  const frequency = normalizePaymentFrequency(
    emp.paymentFrequency
  );

  /*
   * Do not silently mark an unknown frequency as paid.
   */
  if (!frequency) {
    console.warn(
      "Invalid payment frequency:",
      emp.paymentFrequency,
      emp
    );

    return "due";
  }

  const lastPayment = getLastSuccessfulPayment(
    emp,
    transactions
  );

  /*
   * No successful payment exists.
   * Therefore payment is due.
   */
  if (!lastPayment) {
    return "due";
  }

  /*
   * Calculate the NEXT payment date 
   */
  const nextPaymentDate = calculateNextPaymentDate(
    lastPayment,
    frequency
  );

  if (!nextPaymentDate) {
    return "due";
  }

  const now = new Date();

  return now >= nextPaymentDate
    ? "due"
    : "paid";
};
