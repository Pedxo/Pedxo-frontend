export const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${className}`}
  />
);
