import { NavLink } from "react-router-dom";

const CreateContractBtn = () => {
  return (
    <div className="py-[14px] px-5 font-semibold text-base mt-[15px] border-clr rounded-lg flex items-center justify-center gap-[10px]">
      <NavLink
        to="/dashboard/create-contract"
        className="flex items-center gap-[10px]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Layer_1" clip-path="url(#clip0_2021_835)">
            <g id="Group">
              <g id="Group_2">
                <path
                  id="Vector"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.5 0H2.25C1.00744 0 0 1.00744 0 2.25V15.75C0 16.9926 1.00744 18 2.25 18H8.4375V16.875H2.25C1.63041 16.875 1.125 16.3707 1.125 15.75V2.25C1.125 1.62928 1.63041 1.125 2.25 1.125H13.5C14.1207 1.125 14.625 1.62928 14.625 2.25V8.86373L15.75 7.73873V2.25C15.75 1.00744 14.7426 0 13.5 0Z"
                  fill="black"
                />
              </g>
            </g>
            <path
              id="Vector_2"
              d="M17.6704 10.125L16.875 9.32963C16.6552 9.10983 16.3675 9 16.0796 9C15.7918 9 15.5039 9.10983 15.2843 9.32963L10.4546 14.1593C10.2348 14.379 9.56278 15.2287 9.5625 15.5166L9 18L11.4829 17.4375C11.4829 17.4375 12.6211 16.7652 12.8407 16.5454L17.6704 11.7157C18.1098 11.2764 18.1098 10.5639 17.6704 10.125ZM12.4442 16.1466C12.3805 16.207 12.1601 16.3558 11.891 16.5272L10.4337 15.0699C10.5832 14.865 10.7495 14.659 10.8523 14.5569L14.4887 10.9205L16.0796 12.5114L12.4442 16.1466Z"
              fill="#03A9F4"
            />
            <path
              id="Vector_3"
              d="M12.375 4.5H3.375V3.375H12.375V4.5Z"
              fill="#B0BEC5"
            />
            <path
              id="Vector_4"
              d="M12.375 6.75H3.375V5.625H12.375V6.75Z"
              fill="#B0BEC5"
            />
            <path
              id="Vector_5"
              d="M12.375 9H3.375V7.875H12.375V9Z"
              fill="#B0BEC5"
            />
            <path
              id="Vector_6"
              d="M7.875 11.25H3.375V10.125H7.875V11.25Z"
              fill="#B0BEC5"
            />
          </g>
          <defs>
            <clipPath id="clip0_2021_835">
              <rect width="18" height="18" fill="white" />
            </clipPath>
          </defs>
        </svg>
        Create Contract
      </NavLink>
    </div>
  );
};
export default CreateContractBtn;
