export const Loader = ({ size = "12", color = "blue-600" }) => (
  <div className="flex justify-center items-center py-10">
    <div 
      className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-${color}`}
    ></div>
  </div>
);

export default Loader;