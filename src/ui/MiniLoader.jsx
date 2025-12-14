import { ClipLoader } from "react-spinners";

export default function MiniLoader({ color = "#fff", size = 20, variant = "clip" }) {
  if (variant === "clip") {
    return <ClipLoader color={color} size={size} />;
  }

  // fallback CSS spinner (keeps compatibility)
  const borderSize = Math.max(1, Math.round(size / 8));
  return (
    <div
      className="rounded-full animate-spin mx-auto"
      style={{
        width: size,
        height: size,
        borderStyle: "solid",
        borderWidth: borderSize,
        borderColor: color,
        borderTopColor: "transparent",
        boxSizing: "border-box",
      }}
    />
  );
}
