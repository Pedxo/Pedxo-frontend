import { useState } from "react"
import { useUser } from "../context/UserContext"
import CopyIcon from "../assets/icons/CopyIcon"
import MoneyIcon from "../assets/icons/MoneyIcon"
import PayrollIcon from "../assets/icons/PayRollIcon"

const Account = () => {
  const { username, email } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [showBankName, setShowBankName] = useState(false)
  const balance = 58000.5

  const isNigerianUser = false 

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <section className="mt-16 mx-5 xl:ml-20 xl:mr-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-semibold">Accounts</h1>
        <div className="flex items-center gap-2 text-sm lg:text-base font-medium bg-gray-100 px-4 py-2 rounded-md">
          <MoneyIcon />
          {isNigerianUser ? '₦' : '$'} {balance.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white p-4 rounded-xl w-full max-w-4xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg uppercase">
            {username[0]}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="font-medium text-base">{username}</p>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">
              {email || "pedxo@gmail.com"}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:items-end">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-[24px] text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <PayrollIcon />
            Deposit funds
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 flex flex-col gap-4">
            <h2 className="text-[14px] font-semibold">Copy and transfer into this Account to deposit</h2>

            {isNigerianUser ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-500">Account Name</p>
                    <p className="font-semibold text-base">Victor Chukwuma</p>
                  </div>
                  <button onClick={() => copyToClipboard("Victor Chukwuma")}>
                    <CopyIcon />
                  </button>
                </div>

                <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-semibold text-base">9461541392</p>
                  </div>
                  <button onClick={() => copyToClipboard("9461541392")}>
                    <CopyIcon />
                  </button>
                </div>

                <p className="font-semibold text-sm text-gray-800 pl-1">Bank Name: Wema Bank PLC</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-500">Account Name</p>
                    <p className="font-semibold text-base">Victor Chukwuma</p>
                  </div>
                  <button onClick={() => copyToClipboard("Victor Chukwuma")}>
                    <CopyIcon />
                  </button>
                </div>

                <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-semibold text-base">216328641937</p>
                  </div>
                  <button onClick={() => copyToClipboard("216328641937")}>
                    <CopyIcon />
                  </button>
                </div>

                <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-500">Wire Routing</p>
                    <p className="font-semibold text-base">101019644</p>
                  </div>
                  <button onClick={() => copyToClipboard("101019644")}>
                    <CopyIcon />
                  </button>
                </div>

                <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-500">ACH Routing</p>
                    <p className="font-semibold text-base">101019644</p>
                  </div>
                  <button onClick={() => copyToClipboard("101019644")}>
                    <CopyIcon />
                  </button>
                </div>

                <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-semibold text-base">Checking</p>
                  </div>
                  <button onClick={() => copyToClipboard("Checking")}>
                    <CopyIcon />
                  </button>
                </div>

                <div className="flex justify-between items-start border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-500">Bank Address</p>
                    <p className="font-semibold text-base">1801 Main St., Kansas City, MO 64108</p>
                  </div>
                  <button onClick={() => copyToClipboard("1801 Main St., Kansas City, MO 64108")}>
                    <CopyIcon />
                  </button>
                </div>

                <button 
                  onClick={() => setShowBankName(!showBankName)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  {showBankName ? "Hide Bank Name" : "View Bank Name"}
                </button>

                {showBankName && (
                  <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                    <div>
                      <p className="text-sm text-gray-500">Bank Name</p>
                      <p className="font-semibold text-base">Lead Bank</p>
                    </div>
                    <button onClick={() => copyToClipboard("Lead Bank")}>
                      <CopyIcon />
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 self-end text-sm text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Account