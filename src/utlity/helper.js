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
export function formatCurrency(amount, currency = 'NGN', locale = 'en-NG') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}
