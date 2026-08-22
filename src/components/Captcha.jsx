import { useEffect, useState } from "react";
import authFetch from "../api";
import toast from "react-hot-toast";

const Captcha = ({ onCaptchaChange, disabled = false }) => {
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCaptcha = async () => {
    setLoading(true);

    try {
      const response = await authFetch.get("/auth/captcha");

      const { captchaId, image } = response.data;

      setCaptchaId(captchaId);
      setCaptchaImage(image);
      setCaptchaAnswer("");

      onCaptchaChange({
        captchaId,
        captchaAnswer: "",
        verified: false,
      });
    } catch (error) {
      console.error("Failed to load CAPTCHA:", error);
      toast.error("Unable to load security verification.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleHumanChange = async (e) => {
    const checked = e.target.checked;

    setIsHuman(checked);

    if (!checked) {
      setCaptchaAnswer("");

      onCaptchaChange({
        captchaId,
        captchaAnswer: "",
        verified: false,
      });

      return;
    }

    /*
     * Request a fresh challenge when the user
     * confirms that they are human.
     */
    await fetchCaptcha();
  };

  const handleAnswerChange = (e) => {
    const value = e.target.value;

    setCaptchaAnswer(value);

    onCaptchaChange({
      captchaId,
      captchaAnswer: value,
      verified: isHuman && value.trim().length > 0,
    });
  };

  const handleRefresh = async () => {
    setIsHuman(false);
    setCaptchaAnswer("");

    onCaptchaChange({
      captchaId: "",
      captchaAnswer: "",
      verified: false,
    });

    await fetchCaptcha();
  };

  return (
    <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
      {/* I AM NOT A ROBOT */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isHuman}
          onChange={handleHumanChange}
          disabled={disabled || loading}
          className="w-5 h-5 cursor-pointer"
        />

        <span className="text-sm font-medium text-gray-700">
          I am not a robot
        </span>
      </label>

      {/* CAPTCHA CHALLENGE */}
      {isHuman && (
        <div className="mt-4">
          <p className="text-xs text-gray-600 mb-2">
            Enter the characters shown below.
          </p>

          <div className="flex items-center gap-3">
            {captchaImage ? (
              <img
                src={captchaImage}
                alt="Security verification CAPTCHA"
                className="h-12 w-auto border border-gray-300 rounded bg-white"
              />
            ) : (
              <div className="h-12 w-[180px] flex items-center justify-center border border-gray-300 rounded bg-white text-xs text-gray-500">
                {loading ? "Loading..." : "CAPTCHA unavailable"}
              </div>
            )}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={disabled || loading}
              className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          <input
            type="text"
            value={captchaAnswer}
            onChange={handleAnswerChange}
            disabled={disabled || loading}
            autoComplete="off"
            spellCheck="false"
            placeholder="Enter CAPTCHA"
            className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default Captcha;