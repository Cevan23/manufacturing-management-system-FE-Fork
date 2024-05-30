import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet, FlatList, Modal, TextInput, TouchableOpacity } from "react-native";
import {
  deleteInventoryMaterial,
  getAllInventoryMaterials,
  createInventoryMaterial,
  updateInventoryMaterial, // Import the function to update a product
} from "../../services/InventoryServices";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import AppLoader from "../../components/AppLoader";
import { LeftSwipe, RightSwipe, AlertWithTwoOptions, CustomButton } from "../../components";

// Inventory Material Page
// Author: Pham Hien Nhan
const InventoryMaterial = () => {
  const [InventoryMaterials, setInventoryMaterials] = useState([]);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [form, setForm] = useState({
    inventoryId: "",
    materialId: "",
    quantity: "",
    safetyStockAmount: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMaterial, setselectedMaterial] = useState(null);
  const [selectedMaterialId, setselectedMaterialId] = useState(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const { token } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  // Fetch data for inventory materials
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get all inventory materials
      const res = await getAllInventoryMaterials(token);
      setInventoryMaterials(res.result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Group inventory materials by inventory id
  const groupByInventoryId = (materials) => {
    return materials.reduce((groups, material) => {
      const inventoryId = material.id.inventoryId;
      if (!groups[inventoryId]) {
        groups[inventoryId] = [];
      }
      groups[inventoryId].push(material);
      return groups;
    }, {});
  };

  const groupedMaterials = groupByInventoryId(InventoryMaterials);

  // Handle swipe item press
  const handleSwipeItemPress = (title, material) => {
    if (title === "Delete") {
      setselectedMaterialId(material.id.materialId);
      setSelectedInventoryId(material.id.inventoryId);
      setConfirmationModalVisible(true);
    } else if (title === "Edit") {
      handleEditPress(material);
    }
  };

  // Handle delete product material
  const handleDeleteProductMaterial = async () => {
    try {
      await deleteInventoryMaterial(
        token,
        selectedMaterialId,
        selectedInventoryId
      );
      setInventoryMaterials((prevProducts) =>
        prevProducts.filter(
          (product) => product.id.materialId !== selectedMaterialId
        )
      );
    } catch (err) {
      // handle error, e.g., show a message to the user
    } finally {
      setConfirmationModalVisible(false);
    }
  };

  // Handle form change
  const handleFormChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Handle form submit
  const handleFormSubmit = async () => {
    if (isEditMode) {
      try {
        const updatedProduct = {
          inventoryId: selectedMaterial.id.inventoryId,
          materialId: selectedMaterial.id.materialId,
          quantity: form.quantity,
          safetyStockAmount: form.safetyStockAmount,
        };
        await updateInventoryMaterial(token, updatedProduct);
        setInventoryMaterials((prevProducts) =>
          prevProducts.map((product) =>
            product.id.materialId === selectedMaterial.id.materialId
              ? { ...product, ...updatedProduct }
              : product
          )
        );
        setFormModalVisible(false);
        setForm({
          inventoryId: "",
          materialId: "",
          quantity: "",
          safetyStockAmount: "",
        });
      } catch (err) {
        // handle error, e.g., show a message to the user
      }
    } else {
      try {
        const newMaterial = {
          inventoryId: form.inventoryId,
          materialId: form.materialId,
          quantity: form.quantity,
          safetyStockAmount: form.safetyStockAmount,
        };
        const res = await createInventoryMaterial(token, newMaterial);
        setInventoryMaterials([...InventoryMaterials, res.result]);
        setFormModalVisible(false);
        setForm({
          inventoryId: "",
          materialId: "",
          quantity: "",
          safetyStockAmount: "",
        });
      } catch (err) {
        // handle error, e.g., show a message to the user
      }
    }
  };

  // Handle edit press
  const handleEditPress = (material) => {
    setselectedMaterial(material);
    setForm({
      inventoryId: material.id.inventoryId,
      materialId: material.id.materialId,
      quantity: material.quantity.toString(),
      safetyStockAmount: material.safetyStockAmount.toString(),
    });
    setIsEditMode(true);
    setFormModalVisible(true);
  };

  // Render group of inventory materials
  const renderGroup = ({ item: [inventoryId, materials] }) => (
    <View key={inventoryId}>
      <View>
        <Text style={styles.inventoryTitle}>Inventory No. {inventoryId}</Text>
        <Text style={styles.inventoryName}>{materials[0].inventory.name}</Text>
      </View>
      {materials.map((material, index) => (
        <Swipeable
          key={material.id.materialId}
          renderLeftActions={() => (
            <LeftSwipe
              onPressItem={(title) => handleSwipeItemPress(title, material)}
            />
          )}
          renderRightActions={() => (
            <RightSwipe
              onPressItem={(title) => handleSwipeItemPress(title, material)}
            />
          )}
        >
          <Card style={styles.card}>
            <Card.Title
              title={`Material No. ${material.id.materialId}`}
              titleStyle={styles.title}
            />
            <Card.Content>
              <Text style={styles.text}>
                Material name: {material.material.name}
              </Text>
              <Text style={styles.text}>Quantity: {material.quantity}</Text>
              <Text style={styles.text}>
                Safety Stock Amount: {material.safetyStockAmount}
              </Text>
            </Card.Content>
          </Card>
        </Swipeable>
      ))}
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {Object.entries(groupedMaterials).length > 0 ? (
          <FlatList
            data={Object.entries(groupedMaterials)}
            keyExtractor={(item) => item[0]}
            renderItem={renderGroup}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No Inventory Materials Available
            </Text>
          </View>
        )}

        <CustomButton
          icon={"plus"}
          iconSize={28}
          containerStyles="p-0 absolute bottom-32 self-end right-4 h-12 w-12 rounded-full bg-green-500 items-center justify-center"
          isLoading={false}
          handlePress={() => {
            setIsEditMode(false);
            setForm({
              inventoryId: "",
              materialId: "",
              quantity: "",
              safetyStockAmount: "",
            }); // Clear the form state when opening the modal for creation
            setFormModalVisible(true);
          }}
        />
      </View>
      {loading ? <AppLoader /> : null}

      <AlertWithTwoOptions
        visible={confirmationModalVisible}
        message="Are you sure want to delete?"
        onYesPress={handleDeleteProductMaterial}
        onNoPress={() => setConfirmationModalVisible(false)}
      />

      <Modal
        visible={formModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFormModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditMode ? "Edit Material" : "Create New Inventory Material"}
            </Text>
            {!isEditMode && ( 
              <>
                <Text style={styles.label}>Inventory Id</Text>
                <TextInput
                  value={form.inventoryId}
                  onChangeText={(text) => handleFormChange("inventoryId", text)}
                  style={styles.input}
                />
                <Text style={styles.label}>Material Id</Text>
                <TextInput
                  value={form.materialId}
                  onChangeText={(text) => handleFormChange("materialId", text)}
                  style={styles.input}
                />
              </>
            )}
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              value={form.quantity}
              onChangeText={(text) => handleFormChange("quantity", text)}
              style={styles.input}
            />
            <Text style={styles.label}>Safety Stock Amount</Text>
            <TextInput
              value={form.safetyStockAmount}
              onChangeText={(text) =>
                handleFormChange("safetyStockAmount", text)
              }
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleFormSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setFormModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    flex: 1,
    paddingBottom: 100,
    paddingHorizontal: 10,
  },
  inventoryTitle: {
    color: "#FFA500",
    fontSize: 15,
    paddingTop: 10,
  },
  inventoryName: {
    color: "#FFA500",
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
    paddingBottom: 10,
  },
  title: {
    color: "#FFA500",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    color: "#000",
    fontSize: 16,
  },
  card: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: "#ff9c01",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#161622",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  label: {
    color: "#ff9c01",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  submitButton: {
    backgroundColor: "rgb(34, 197, 94)",
  },
  cancelButton: {
    backgroundColor: "rgb(239, 68, 68)",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default InventoryMaterial;
