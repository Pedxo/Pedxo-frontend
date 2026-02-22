// utility/profileImages.js
import image1 from "../assets/svg/image1.svg";
import image2 from "../assets/svg/image2.svg";
import image3 from "../assets/svg/image3.svg";
import image4 from "../assets/svg/image4.svg";
import image5 from "../assets/svg/image5.svg";
import image6 from "../assets/svg/image6.svg";
import image7 from "../assets/svg/image7.svg";
import image8 from "../assets/svg/image8.svg";
import image9 from "../assets/svg/image9.svg";
import image10 from "../assets/svg/image10.svg";
import image11 from "../assets/svg/image11.svg";
import image12 from "../assets/svg/image12.svg";
import image13 from "../assets/svg/image13.svg";
import image14 from "../assets/svg/image14.svg";
import image15 from "../assets/svg/image15.svg";

/** EXPORT IMAGES FOR FALLBACK USE */
export const profileImages = [
  image1, image2, image3, image4, image5,
  image6, image7, image8, image9, image10,
  image11, image12, image13, image14, image15,
];

/**
 * STABLE EMPLOYEE KEY
 * Same person → same avatar everywhere
 */
export const getEmployeeKey = (emp) => {
  const userId =
    emp.userId ||
    emp.user?._id ||
    emp._id ||
    emp.email;

  if (!userId) return null;

  return String(userId).toLowerCase();
};

/**
 * Deterministic avatar assignment
 */
export const getProfileImagesMapping = (employees) => {
  const stored = JSON.parse(
    localStorage.getItem("employeeImages") || "{}"
  );

  const mapping = { ...stored };
  let index = Object.keys(mapping).length;

  employees.forEach((emp) => {
    const key = getEmployeeKey(emp);
    if (!key) return;

    if (!mapping[key]) {
      mapping[key] =
        profileImages[index % profileImages.length];
      index++;
    }
  });

  localStorage.setItem(
    "employeeImages",
    JSON.stringify(mapping)
  );

  return mapping;
};