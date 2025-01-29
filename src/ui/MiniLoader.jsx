import { ClipLoader } from "react-spinners";

export default function MiniLoader({ color = "#fff" }) {
  return <ClipLoader color={color} size={20} />;
}