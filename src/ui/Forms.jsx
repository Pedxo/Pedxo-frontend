import { Switch } from "@material-tailwind/react";
import CustomForm from "./CustomForm";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";
import DatePicker from "./DatePicker";
import { useState } from "react";
import Button from "./Button";
import { AiOutlineSignature } from "react-icons/ai";
import { ImCheckmark } from "react-icons/im";
import { FaPaperPlane } from "react-icons/fa6";
import Modal from "./Modal";
import ContractSent from "./ContractSent";

const dummyOptions = [
  { value: "value1", label: "Value 1" },
  { value: "value2", label: "Value 2" },
];

const finalData = [
  {
    title: "Contract",
    value: "Gig Based",
  },
  {
    title: "Start Date",
    value: "Aug 18 2024",
  },
  {
    title: "End Date",
    value: "Aug 18 2024",
  },
  {
    title: "Job Title",
    value: "Backend Developer",
  },
  {
    title: "Seniority Level",
    value: "Senior",
  },
  {
    title: "Scope of work",
    value:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, cumque.",
  },
  {
    title: "Payment Rate",
    value: "$5000",
  },
  {
    title: "Payment Frequency",
    value: "Monthly",
  },
];

export function PersonalInformationForm() {
  return (
    <section className="flex w-full flex-col gap-10">
      <h2 className="heading-2">Personal Information</h2>
      <CustomForm>
        <CustomInput label="Client Name" required />
        <CustomInput label="Email" type="email" required />
        {/* <CustomInput label="Country" type="email" required /> */}
        <CustomSelect label="Country" required options={dummyOptions} />
        <CustomSelect
          label="Region/Province/State"
          required
          options={dummyOptions}
        />
      </CustomForm>
    </section>
  );
}

export function JobDetailsForm({ ct }) {
  const [showForm, setShowForm] = useState(true);
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="space-y-1">
        <h2 className="heading-2">Role Details</h2>
        <p className="paragraph-1">
          {ct === "full-time" ? "Full-Time Role" : "Gig-Based Role"}
        </p>
      </div>
      <CustomForm>
        <CustomSelect label="Role Title (Optional)" options={dummyOptions} />
        <CustomSelect
          label="Seniority Level (Optional)"
          options={dummyOptions}
        />
        <CustomSelect label="Scope of work template" options={dummyOptions} />
        <div className="flex flex-col gap-3">
          <p className="flex items-center text-sm font-semibold gap-1">
            Start Date
            <span className="text-red-500">*</span>
          </p>
          <DatePicker label="Select Start Date" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="w-full flex items-center justify-between">
            <p
              className={`flex items-center text-sm font-semibold gap-1 ${
                showForm && "text-black/40"
              } `}
            >
              End Date
              <span className="text-red-500">*</span>
            </p>
            <Switch
              color="blue"
              value={showForm}
              onChange={() => setShowForm(!showForm)}
            />
          </div>
          <DatePicker disabled={showForm} label="Select End Date" />
        </div>
        <div className="flex flex-col gap-3">
          <p className="flex items-center text-sm font-semibold gap-1">
            Explanation of Scope of work
            <span className="text-red-500">*</span>
          </p>
          <textarea className="resize-none h-44 p-4 text-sm rounded-md focus:ring-1 focus:ring-primary focus:outline-none"></textarea>
        </div>
      </CustomForm>
    </section>
  );
}

export function CompensationBudgetForm() {
  return (
    <section className="flex w-full flex-col gap-10">
      <h2 className="heading-2">Compensation and Budget</h2>

      <CustomForm>
        <CustomInput label="Payment Rate (USD)" required />
        <CustomSelect
          label="Payment Frequency"
          required
          options={dummyOptions}
        />
      </CustomForm>
    </section>
  );
}

export function ReviewFormData({ setStep, hasSignature }) {
  return (
    <Modal>
      <section className="flex w-full flex-col gap-10">
        <h2 className="heading-2">Review and Sign Contract</h2>

        <ul className="py-8 px-4 rounded-md bg-white flex flex-col gap-3">
          {finalData.map((el, i) => (
            <li
              key={i}
              className="flex text-sm  items-start p-1 justify-between"
            >
              <h2 className="flex-shrink-0 font-semibold text-black/50">
                {el.title}
              </h2>
              <p className="text-sm w-28 text-center lg:text-left lg:w-48">{el.value}</p>
            </li>
          ))}
        </ul>
        {!hasSignature ? (
          <button
            onClick={() => setStep(5)}
            className="p-3 border hover:bg-brandGrey transition-all duration-200 ease-in border-black/10 rounded-md w-full bg-brandGrey/40 text-sm flex items-center justify-between text-black/60"
          >
            Sign Contract
            <AiOutlineSignature size={18} />
          </button>
        ) : (
          <div className="w-full flex items-center justify-center">
            <Modal.Open opens="contract_sent">
              <Button
                type="primary"
                // onClick={() => toast.success("Contract Sent")}
                iconRight={<FaPaperPlane />}
              >
                Send Contract
              </Button>
            </Modal.Open>
          </div>
        )}
      </section>
      <Modal.Window name="contract_sent">
        <ContractSent />
      </Modal.Window>
    </Modal>
  );
}

export function SignContract({ setHasSignature, setStep }) {
  const handleUseSignature = () => {
    setHasSignature(true);
    setStep(4);
  };

  return (
    <section className="flex w-full flex-col gap-10">
      <h2 className="heading-2">Signature</h2>
      <div className="rounded-md w-full bg-white h-44"></div>
      <div className="w-full flex items-center justify-center">
        <Button
          onClick={handleUseSignature}
          iconRight={<ImCheckmark />}
          type="primary"
        >
          Use signature
        </Button>
      </div>
    </section>
  );
}
