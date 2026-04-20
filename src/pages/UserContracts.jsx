import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContracts from '../features/contracts/useUserContracts';
import { formatDate } from '../utility/helper';
import { FaFileContract, FaClock, FaCheckCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const UserContracts = () => {
  const navigate = useNavigate();
  const { contracts, total, isLoading, error } = useUserContracts();

  const handleContractClick = (contract) => {
    // Navigate to the appropriate form based on contractType
    const formRoute = contract.contractType === 'gig-based' 
      ? '/dashboard/gig-based-form' 
      : '/dashboard/full-time-form';
    
    // Pass the contractId as a query parameter
    navigate(`${formRoute}?contractId=${contract._id}`);
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const getProgressBadge = (progress, isCompleted) => {
    if (isCompleted) {
      return {
        text: 'Completed',
        className: 'bg-green-100 text-green-800',
        icon: <FaCheckCircle className="w-3 h-3 mr-1" />
      };
    }
    
    switch (progress) {
      case 'personal-info':
        return {
          text: 'Personal Info',
          className: 'bg-gray-100 text-gray-800',
          icon: null
        };
      case 'job-details':
        return {
          text: 'Job Details',
          className: 'bg-blue-100 text-blue-800',
          icon: null
        };
      case 'compensation':
        return {
          text: 'Compensation',
          className: 'bg-yellow-100 text-yellow-800',
          icon: null
        };
      case 'review':
        return {
          text: 'Review',
          className: 'bg-purple-100 text-purple-800',
          icon: null
        };
      default:
        return {
          text: 'In Progress',
          className: 'bg-orange-100 text-orange-800',
          icon: <FaSpinner className="w-3 h-3 mr-1" />
        };
    }
  };

  const getStepNumber = (progress) => {
    switch (progress) {
      case 'personal-info': return 1;
      case 'job-details': return 2;
      case 'compensation': return 3;
      case 'review': return 4;
      default: return 1;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <p className="text-red-500">Error loading contracts: {error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <>
        <div className="p-6">
          <div
            className="flex items-center gap-1 text-sm font-medium leading-normal pr-text-clr xl:gap-3 cursor-pointer mb-6"
            onClick={handleGoBack}
          >
            <FaArrowLeft size={18} />
            <span>Go back</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 px-4">
          <FaFileContract className="w-16 h-16 text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-600">No Contracts Found</h2>
          <p className="text-gray-500">You haven't created any contracts yet.</p>
          <button 
            onClick={() => navigate('/dashboard/add-developer')}
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Create Your First Contract
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <div
        className="flex items-center gap-1 text-sm font-medium leading-normal pr-text-clr xl:gap-3 cursor-pointer mb-6"
        onClick={handleGoBack}
      >
        <FaArrowLeft size={18} />
        <span>Go back</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Contracts</h1>
        <p className="text-gray-600">
          {total} contract{total !== 1 ? 's' : ''} found. Click any contract to continue editing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contracts.map((contract) => {
          const progressBadge = getProgressBadge(contract.progress, contract.isCompleted);
          const stepNumber = getStepNumber(contract.progress);
          
          return (
            <div
              key={contract._id}
              onClick={() => handleContractClick(contract)}
              className="overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {contract.roleTitle || 'Untitled Contract'}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center ${progressBadge.className}`}>
                    {progressBadge.icon}
                    {progressBadge.text}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium min-w-[70px]">Type:</span> 
                    <span className="capitalize">{contract.contractType || 'Full Time'}</span>
                  </p>
                  {contract.clientName && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium min-w-[70px]">Client:</span> 
                      <span className="truncate">{contract.clientName}</span>
                    </p>
                  )}
                  {contract.companyName && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium min-w-[70px]">Company:</span> 
                      <span className="truncate">{contract.companyName}</span>
                    </p>
                  )}
                  {contract.startDate && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium min-w-[70px]">Start Date:</span> 
                      {formatDate(contract.startDate)}
                    </p>
                  )}
                  {contract.paymentRate && contract.paymentFrequency && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium min-w-[70px]">Budget:</span> 
                      {contract.paymentRate.toLocaleString()} / {contract.paymentFrequency}
                    </p>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="pt-4 mt-3 border-t">
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>Step {stepNumber} of 4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(stepNumber / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-blue-600">
                      <FaClock className="w-3 h-3" />
                      Click to continue
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(contract.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserContracts;