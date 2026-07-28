import {
  FaLinkedin,
  FaWhatsapp,
  FaGitlab,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaBehance,
  FaDribbble,
  FaGlobe,
} from "react-icons/fa";

const SocialProfileModal = ({
  isOpen,
  employee,
  onClose,
}) => {
  if (!isOpen) return null;

// Read only from socialProfiles returned by backend
const socialProfiles = employee?.socialProfiles || {};

  const profiles = [
    {
      label: "LinkedIn",
      url: socialProfiles?.linkedin,
      icon: <FaLinkedin className="text-[#0A66C2]" />,
    },
    {
      label: "GitLab",
      url: socialProfiles?.gitlab,
      icon: <FaGitlab className="text-[#FC6D26]" />,
    },
    {
      label: "Twitter",
      url: socialProfiles?.twitter,
      icon: <FaTwitter className="text-[#1DA1F2]" />,
    },
    {
      label: "Facebook",
      url: socialProfiles?.facebook,
      icon: <FaFacebook className="text-[#1877F2]" />,
    },
    {
      label: "Instagram",
      url: socialProfiles?.instagram,
      icon: <FaInstagram className="text-pink-500" />,
    },
    {
      label: "TikTok",
      url: socialProfiles?.tiktok,
      icon: <FaTiktok />,
    },
    {
      label: "YouTube",
      url: socialProfiles?.youtube,
      icon: <FaYoutube className="text-red-600" />,
    },
    {
      label: "Behance",
      url: socialProfiles?.behance,
      icon: <FaBehance className="text-blue-600" />,
    },
    {
      label: "Dribbble",
      url: socialProfiles?.dribbble,
      icon: <FaDribbble className="text-pink-600" />,
    },
    // WhatsApp newly added
    {
      label: "WhatsApp",
      url: socialProfiles?.whatsapp
        ? `https://wa.me/${socialProfiles.whatsapp.replace(/\D/g, "")}`
        : "",
      icon: <FaWhatsapp className="text-[#25D366]" />,
    },
    {
      label: "Other",
      url: socialProfiles?.other,
      icon: <FaGlobe />,
    },
  ].filter( (item) => typeof item.url === "string" && item.url.trim() !== "");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    {/* Modal Container */}
    
    <div className="bg-white rounded-xl w-full max-w-lg max-h-[75vh] flex flex-col">

      {/* Header  */}
    
      <div className="flex justify-between items-center p-6 border-b flex-shrink-0">

        <h2 className="font-semibold text-lg">
          Social Profiles
        </h2>

        <button
          onClick={onClose}
          className="text-xl font-bold hover:text-red-500 transition-colors"
        >
          ×
        </button>

      </div>

      <div className="overflow-y-auto p-6">

        {profiles.length === 0 ? (

          <div className="text-gray-500 text-center py-8">
            No social profiles available
          </div>

        ) : (

          <div className="space-y-4">

            {profiles.map((profile) => (

              <a
                key={profile.label}
                href={profile.url}
                target="_blank"
                rel="noreferrer"

                
                className="
                  flex
                  items-center
                  gap-3
                  border
                  rounded-lg
                  p-3
                  bg-white
                  hover:bg-gray-100
                  transition-colors
                  duration-200
                  text-black
                  no-underline
                "
              >

                <div className="text-xl flex-shrink-0">
                  {profile.icon}
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">

                  <span
                    className="
                      font-semibold
                      text-gray-900
                      truncate
                    "
                  >
                    {profile.label}
                  </span>

                  {/* ------------------------------------------------------
                   <span
                    className="
                      text-sm
                      text-blue-600
                      truncate
                    "
                  >
                    {profile.url}
                  </span>
                  ------------------------------------------------------- */}

                </div>

              </a>

            ))}

          </div>

        )}

      </div>

    </div>

  </div>
  );
};

export default SocialProfileModal;