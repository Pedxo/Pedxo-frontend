import Button from "../ui/Button.jsx";
import { useNavigate } from "react-router-dom";
import noPage from "../assets/svg/pagenotfound.svg";

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0  flex-col w-full h-screen flex items-center justify-center gap-4">
      <img src={noPage} className="max-w-80 lg:max-w-96" alt="404_image" />
      <p className="text-sm font-semibold">
        Ooops.....seems you found a missing page.
      </p>
      {/* question */}
      <Button onClick={() => navigate("/")} type="primary" size="regular">
        Back to Safety
      </Button>
    </div>
  );
}

export default PageNotFound;
