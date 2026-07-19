import {
    FaLinkedin,
    FaGithub,
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
  
    const profiles = [
      {
        label: "LinkedIn",
        url: employee?.linkedinAccount,
        icon: <FaLinkedin className="text-[#0A66C2]" />,
      },
      {
        label: "Github",
        url: employee?.githubAccount,
        icon: <FaGithub />,
      },
      {
        label: "GitLab",
        url: employee?.gitlabAccount,
        icon: <FaGitlab className="text-[#FC6D26]" />,
      },
      {
        label: "Twitter",
        url: employee?.twitterAccount,
        icon: <FaTwitter className="text-[#1DA1F2]" />,
      },
      {
        label: "Facebook",
        url: employee?.facebookAccount,
        icon: <FaFacebook className="text-[#1877F2]" />,
      },
      {
        label: "Instagram",
        url: employee?.instagramAccount,
        icon: <FaInstagram className="text-pink-500" />,
      },
      {
        label: "TikTok",
        url: employee?.tiktokAccount,
        icon: <FaTiktok />,
      },
      {
        label: "YouTube",
        url: employee?.youtubeAccount,
        icon: <FaYoutube className="text-red-600" />,
      },
      {
        label: "Behance",
        url: employee?.behanceAccount,
        icon: <FaBehance className="text-blue-600" />,
      },
      {
        label: "Dribbble",
        url: employee?.dribbbleAccount,
        icon: <FaDribbble className="text-pink-600" />,
      },
      {
        label: "Other",
        url: employee?.other,
        icon: <FaGlobe />,
      },
    ].filter((item) => item.url);
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-lg p-6">
  
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg">
              Social Profiles
            </h2>
  
            <button
              onClick={onClose}
              className="text-xl font-bold"
            >
              ×
            </button>
          </div>
  
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
                  className="flex items-center gap-3 border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="text-xl">
                    {profile.icon}
                  </div>
  
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold">
                      {profile.label}
                    </span>
  
                    <span className="text-blue-600 text-sm truncate">
                      {profile.url}
                    </span>
                  </div>
                </a>
              ))}
  
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default SocialProfileModal;