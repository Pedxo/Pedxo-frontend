import { useEffect, useState } from "react";
import authFetch from "../api";
import toast from "react-hot-toast";

const Captcha = ({
  onCaptchaChange,
  disabled = false,
  verificationStatus = "idle",
}) => {
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [loading, setLoading] = useState(false);

  /*
   * Send CAPTCHA state to parent.
   *
   * IMPORTANT:
   * verified does NOT mean backend verification.
   * Backend verification happens when /auth is submitted.
   */
  const notifyParent = (id, answer, checked) => {
    onCaptchaChange({
      captchaId: id,
      captchaAnswer: answer,
      verified: Boolean(
        id &&
        checked &&
        answer.trim().length > 0
      ),
    });
  };

  /*
   * =========================================================
   * FETCH CAPTCHA
   * =========================================================
   *
   * Backend endpoint:
   *
   * GET /captcha/generate
   *
   * Backend response:
   * {
   *   captchaId: "...",
   *   image: "<svg>...</svg>"
   * }
   */
  const fetchCaptcha = async (humanChecked = isHuman) => {
    setLoading(true);

    try {
      const response = await authFetch.get("/captcha/generate");

      const {
        captchaId: newCaptchaId,
        image,
      } = response.data;

      if (!newCaptchaId || !image) {
        throw new Error(
          "Invalid CAPTCHA response from server."
        );
      }

      /*
       * Backend returns RAW SVG.
       *
       * Convert it into a data URI so <img> can render it.
       */
      const svgDataUri =
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(image)}`;

      setCaptchaId(newCaptchaId);
      setCaptchaImage(svgDataUri);
      setCaptchaAnswer("");

      /*
       * New CAPTCHA is not verified yet.
       */
      notifyParent(
        newCaptchaId,
        "",
        humanChecked
      );

    } catch (error) {
      console.error(
        "Failed to load CAPTCHA:",
        error
      );

      setCaptchaId("");
      setCaptchaImage("");
      setCaptchaAnswer("");

      notifyParent("", "", false);

      const message = Array.isArray(
        error.response?.data?.message
      )
        ? error.response.data.message.join(", ")
        : error.response?.data?.message;

      toast.error(
        message ||
          "Unable to load security verification. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial CAPTCHA generation.
   */
  useEffect(() => {
    fetchCaptcha(false);

    // We intentionally only want this once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * =========================================================
   * HUMAN CHECKBOX
   * =========================================================
   */
  const handleHumanChange = async (e) => {
    const checked = e.target.checked;

    setIsHuman(checked);
    setCaptchaAnswer("");

    if (!checked) {
      notifyParent(
        captchaId,
        "",
        false
      );

      return;
    }

    /*
     * Generate a fresh CAPTCHA whenever
     * the user activates the verification.
     */
    await fetchCaptcha(true);
  };

  /*
   * =========================================================
   * CAPTCHA INPUT
   * =========================================================
   */
  const handleAnswerChange = (e) => {
    const value = e.target.value;

    setCaptchaAnswer(value);

    notifyParent(
      captchaId,
      value,
      isHuman
    );
  };

  /*
   * =========================================================
   * REFRESH CAPTCHA
   * =========================================================
   */
  const handleRefresh = async () => {
    setCaptchaAnswer("");

    /*
     * Existing CAPTCHA is no longer used.
     */
    notifyParent(
      "",
      "",
      false
    );

    await fetchCaptcha(isHuman);
  };

  /*
   * This status comes from SignUp.jsx AFTER
   * the backend /auth request succeeds or fails.
   */
  const isVerified =
    verificationStatus === "success";

  const hasFailed =
    verificationStatus === "error";

  return (
    <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">

      {/* I AM NOT A ROBOT */}
      <label className="flex items-center gap-3 cursor-pointer select-none">

        <input
          type="checkbox"
          checked={isHuman}
          onChange={handleHumanChange}
          disabled={
            disabled ||
            loading ||
            isVerified
          }
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
            {isVerified
              ? "Security verification completed successfully."
              : hasFailed
              ? "Security verification failed. Please try again."
              : "Enter the characters shown below."}
          </p>

          <div className="flex items-center gap-3">

            {/* =================================================
                SUCCESS STATE
            ================================================= */}
            {isVerified ? (

              <div className="h-12 w-[180px] flex items-center justify-center gap-2 border border-green-500 rounded bg-green-50 text-green-600 font-medium">

                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                <span className="text-sm">
                  Verified
                </span>

              </div>

            ) : captchaImage ? (

              /* =================================================
                 CAPTCHA IMAGE
              ================================================= */
              <img
                src={captchaImage}
                alt="Security verification CAPTCHA"
                className={`h-12 w-auto border rounded bg-white ${
                  hasFailed
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

            ) : (

              /* =================================================
                 LOADING / UNAVAILABLE
              ================================================= */
              <div className="h-12 w-[180px] flex items-center justify-center border border-gray-300 rounded bg-white text-xs text-gray-500">

                {loading
                  ? "Loading..."
                  : "CAPTCHA unavailable"}

              </div>
            )}

            {!isVerified && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={
                  disabled ||
                  loading
                }
                className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
              >
                Refresh
              </button>
            )}

          </div>

          {/* =================================================
              ANSWER INPUT
          ================================================= */}
          <input
            type="text"
            value={captchaAnswer}
            onChange={handleAnswerChange}
            disabled={
              disabled ||
              loading ||
              !captchaId ||
              isVerified
            }
            autoComplete="off"
            spellCheck="false"
            placeholder="Enter CAPTCHA"
            className={`mt-3 w-full border rounded-lg px-3 py-2 text-sm outline-none ${
              isVerified
                ? "border-green-500 bg-green-50"
                : hasFailed
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          />

        </div>
      )}

    </div>
  );
};

export default Captcha;