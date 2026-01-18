const baseUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * 
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  
  if (!token || !token.includes(".")) {
    throw new Error("Authentication expired. Please log in again.");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

/**
 * 
 * @returns {Promise<Array>} 
 */
export const getUserContracts = async () => {
  try {
    const response = await fetch(`${baseUrl}/contracts/get-user-contracts`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contracts: ${response.status}`);
    }

    const json = await response.json();
    console.log('json', json);

    const contracts = Array.isArray(json?.data?.contracts)
      ? json.data.contracts
      : [];

    return contracts;
  } catch (error) {
    console.error("Error fetching user contracts:", error);
    throw error;
  }
};


/**
 * 
 * @param {string} contractId 
 * @returns {Promise<Array>}
 */
export const getAssignedByContract = async (contractId) => {
  try {
    const response = await fetch(
      `${baseUrl}/hire/assigned-by-contract?contractId=${contractId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch assigned for contract ${contractId}: ${response.status}`);
      return []; 
    }

    const json = await response.json();
    const assigned = Array.isArray(json?.data) ? json.data : [];
    
    return assigned;
  } catch (error) {
    console.error(`Error fetching assigned for contract ${contractId}:`, error);
    return []; 
  }
};

/**
 * 
 * @returns {Promise<Array>}
 */
export const getAllAssignedEmployees = async () => {
  try {
    const contracts = await getUserContracts();

    if (!contracts.length) {
      console.log("No contracts found");
      return [];
    }
    const contractIds = contracts
      .map((contract) => contract._id)
      .filter(Boolean);

    console.log(`Found ${contractIds.length} contracts`);
    const assignedPromises = contractIds.map((contractId) =>
      getAssignedByContract(contractId)
    );

    const assignedArrays = await Promise.all(assignedPromises);
    const allAssigned = assignedArrays.flat();
    const sorted = allAssigned.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    console.log(`Total assigned employees: ${sorted.length}`);

    return sorted;
  } catch (error) {
    console.error("Error fetching all assigned employees:", error);
    throw error;
  }
};

/**
 * 
 * @param {string} employeeId 
 * @returns {Promise<Object>} 
 */
export const terminateEmployee = async (employeeId) => {
  try {
    const response = await fetch(`${baseUrl}/hire/terminate/${employeeId}`, {
      method: "DELETE", // or POST, depending on your API
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to terminate employee: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error terminating employee:", error);
    throw error;
  }
};