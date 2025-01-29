import { ClipLoader } from "react-spinners";

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white w-full h-screen">
      <ClipLoader color="#4195f1" size={50} />
    </div>
  );
}

export default Loader;