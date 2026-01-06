export const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);
