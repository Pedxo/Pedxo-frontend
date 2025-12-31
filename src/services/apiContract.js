import authFetch from "../api";
import Cookies from 'js-cookie';

const CONTRACT_DETAILS = 'CONTRACT_DETAILS';

export async function createContractOne(details) {
  const response = await authFetch.post(`/contracts/personal-info`, details);
  Cookies.set(CONTRACT_DETAILS, JSON.stringify(response.data.data), { expires: 3 });
  return response?.data;
}

export async function updateFormTwo(details) {
  const contractDetails = Cookies.get(CONTRACT_DETAILS);
  const parsedDetails = contractDetails ? JSON.parse(contractDetails) : {};
  const response = await authFetch.patch(`/contracts/job-details?contractId=${parsedDetails._id}`, details);
  return response?.data;
}

export async function updateCompensation(details) {
  const contractDetails = Cookies.get(CONTRACT_DETAILS);
  const parsedDetails = contractDetails ? JSON.parse(contractDetails) : {};
  const response = await authFetch.patch(`/contracts/compensation?contractId=${parsedDetails._id}`, details);
  return response.data;
}

export async function postSignature(signature) {
  const contractDetails = Cookies.get(CONTRACT_DETAILS);
  const parsedDetails = contractDetails ? JSON.parse(contractDetails) : {};
  const response = await authFetch.post(`/contracts/signature?contractId=${parsedDetails._id}`, signature, {
    headers: {
      "Content-Type": "multi/form-data",
    },
  });
  return response.data;
}

export async function finalizeContract(details){
  const contractDetails = Cookies.get(CONTRACT_DETAILS);
  const parsedDetails = contractDetails ? JSON.parse(contractDetails) : {};
  const response = await authFetch.patch(`/contracts/finalize?contractId=${parsedDetails._id}`, details);
  Cookies.remove(CONTRACT_DETAILS);
  return response.data;
}