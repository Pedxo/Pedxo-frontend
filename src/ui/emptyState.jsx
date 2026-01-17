const EmptyState = ({
  title = "Nothing here yet",
  message = "No data available.",
  icon = "📭",
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      {title}
    </h3>
    <p className="text-gray-500 text-center">
      {message}
    </p>
  </div>
);

export default EmptyState;
