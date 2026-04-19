import { format, parseISO } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { clsx} from 'clsx'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString) {
  if (!dateString) return
  return format(parseISO(dateString), 'MMM d, yyyy')
}

export function formatCurrency(
  amount = 0,
  currency = "USD",   // DEFAULT = USD 
  locale = currency === "NGN" ? "en-NG" : "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
}