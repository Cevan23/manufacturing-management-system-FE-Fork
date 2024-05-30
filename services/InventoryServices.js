import * as http from "../utils/httpRequest";

// Author: Pham Hien Nhan
// Function to get all inventories
export const getAllInventories = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.get(`/api/inventory/get-all`, config);
    return res;
  } catch (e) {
    console.log("Error at Get Inventory: ", e);
  }
};

// Function to create a new inventory
export const createInventory = async (token, inventory) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.post(`/api/inventory/create`, inventory, config);
    return res;
  } catch (e) {
    console.log("Error at Create Inventory: ", e);
  }
};

// Function to get all inventory materials
export const getAllInventoryMaterials = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.get(`/api/inventory-material/get-all`, config);
    return res;
  } catch (e) {
    console.log("Error at Get Inventory Materials: ", e);
  }
};

// Function to create a new inventory material
export const createInventoryMaterial = async (token, material) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.post(`/api/inventory-material/create`, material, config);
    return res;
  } catch (e) {
    console.log("Error at Create Inventory Material: ", e);
  }
};

// Function to update an inventory material
export const updateInventoryMaterial = async (token, material) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.put(`/api/inventory-material`, material, config);
    return res;
  } catch (e) {
    console.log("Error at Update Inventory Material: ", e);
  }
};

// Function to delete an inventory material
export const deleteInventoryMaterial = async (token, materialId, inventoryId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.del(`/api/inventory-material/delete?materialId=${materialId}&inventoryId=${inventoryId}`, config);
    return res;
  } catch (e) {
    console.log("Error at Delete Inventory Material: ", e.message);
  }
};

// Function to get all inventory products
export const getAllInventoryProducts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.get(`/api/inventory-product/get-all`, config);
    return res;
  } catch (e) {
    console.log("Error at Get Inventory Products: ", e);
  }
};

// Function to create a new inventory product
export const createInventoryProduct = async (token, product) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.post(`/api/inventory-product/create`, product, config);
    return res;
  } catch (e) {
    console.log("Error at Create Inventory Product: ", e);
  }
};

// Function to update an inventory product
export const updateInventoryProduct = async (token, product) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.put(`/api/inventory-product`, product, config);
    return res;
  } catch (e) {
    console.log("Error at Update Inventory Product: ", e);
  }
};

// Function to delete an inventory product
export const deleteInventoryProduct = async (token, productId, inventoryId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await http.del(`/api/inventory-product/delete?productId=${productId}&inventoryId=${inventoryId}`, config);
    return res;
  } catch (e) {
    console.log("Error at Delete Inventory Product: ", e.message);
  }
};
