import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet, FlatList, Modal, TextInput, TouchableOpacity } from "react-native";
import {
  deleteInventoryProduct,
  getAllInventoryProducts,
  createInventoryProduct,
  updateInventoryProduct, 
} from "../../services/InventoryServices";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import AppLoader from "../../components/AppLoader";
import { LeftSwipe,  RightSwipe, AlertWithTwoOptions, CustomButton } from "../../components";

// Inventory Product Page
// Author: Pham Hien Nhan
const InventoryProduct = () => {
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [form, setForm] = useState({
    inventoryId: "",
    productId: "",
    quantity: "",
    safetyStockAmount: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const { token } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  // Fetch data for inventory products
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get all inventory products
      const res = await getAllInventoryProducts(token);
      setInventoryProducts(res.result);
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

  // Group inventory products by inventory id
  const groupByInventoryId = (products) => {
    return products.reduce((groups, product) => {
      const inventoryId = product.id.inventoryId;
      if (!groups[inventoryId]) {
        groups[inventoryId] = [];
      }
      groups[inventoryId].push(product);
      return groups;
    }, {});
  };

  const groupedProducts = groupByInventoryId(inventoryProducts);

  // Handle swipe item press
  const handleSwipeItemPress = (title, product) => {
    if (title === "Delete") {
      setSelectedProductId(product.id.productId);
      setSelectedInventoryId(product.id.inventoryId);
      setConfirmationModalVisible(true);
    } else if (title === "Edit") {
      handleEditPress(product);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    try {
      await deleteInventoryProduct(
        token,
        selectedProductId,
        selectedInventoryId
      );
      setInventoryProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.id.productId !== selectedProductId
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
          inventoryId: selectedProduct.id.inventoryId,
          productId: selectedProduct.id.productId,
          quantity: form.quantity,
          safetyStockAmount: form.safetyStockAmount,
        };
        // Update inventory product
        await updateInventoryProduct(token, updatedProduct);
        setInventoryProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id.productId === selectedProduct.id.productId
              ? { ...product, ...updatedProduct }
              : product
          )
        );
        setFormModalVisible(false);
        setForm({
          inventoryId: "",
          productId: "",
          quantity: "",
          safetyStockAmount: "",
        });
      } catch (err) {
        // handle error, e.g., show a message to the user
      }
    } else {
      try {
        const newProduct = {
          inventoryId: form.inventoryId,
          productId: form.productId,
          quantity: form.quantity,
          safetyStockAmount: form.safetyStockAmount,
        };
        // Create new inventory product
        const res = await createInventoryProduct(token, newProduct);
        setInventoryProducts([...inventoryProducts, res.result]);
        setFormModalVisible(false);
        setForm({
          inventoryId: "",
          productId: "",
          quantity: "",
          safetyStockAmount: "",
        });
      } catch (err) {
        // handle error, e.g., show a message to the user
      }
    }
  };

  // Handle edit press
  const handleEditPress = (product) => {
    setSelectedProduct(product);
    setForm({
      inventoryId: product.id.inventoryId,
      productId: product.id.productId,
      quantity: product.quantity.toString(),
      safetyStockAmount: product.safetyStockAmount.toString(),
    });
    setIsEditMode(true);
    setFormModalVisible(true);
  };

  // Render group by inventory id and populate products
  const renderGroup = ({ item: [inventoryId, products] }) => (
    <View key={inventoryId}>
      <View>
        <Text style={styles.inventoryTitle}>Inventory No. {inventoryId}</Text>
        <Text style={styles.inventoryName}>{products[0].inventory.name}</Text>
      </View>
      {products.map((product, index) => (
        <Swipeable
          key={product.id.productId}
          renderLeftActions={() => (
            <LeftSwipe
              onPressItem={(title) => handleSwipeItemPress(title, product)}
            />
          )}
          renderRightActions={() => (
            <RightSwipe
              onPressItem={(title) => handleSwipeItemPress(title, product)}
            />
          )}
        >
          <Card style={styles.card}>
            <Card.Title
              title={`Product No. ${product.id.productId}`}
              titleStyle={styles.title}
            />
            <Card.Content>
              <Text style={styles.text}>
                Product name: {product.product.name}
              </Text>
              <Text style={styles.text}>Quantity: {product.quantity}</Text>
              <Text style={styles.text}>
                Safety Stock Amount: {product.safetyStockAmount}
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
        {Object.entries(groupedProducts).length > 0 ? (
          <FlatList
            data={Object.entries(groupedProducts)}
            keyExtractor={(item) => item[0]}
            renderItem={renderGroup}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No Inventory Products Available
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
              productId: "",
              quantity: "",
              safetyStockAmount: "",
            }); 
            setFormModalVisible(true);
          }}
        />
      </View>
      {loading ? <AppLoader /> : null}

      <AlertWithTwoOptions
        visible={confirmationModalVisible}
        message="Are you sure want to delete?"
        onYesPress={handleDeleteProduct}
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
              {isEditMode ? "Edit Product" : "Create New Inventory Product"}
            </Text>
            {!isEditMode && (
              <>
                <Text style={styles.label}>Inventory Id</Text>
                <TextInput
                  value={form.inventoryId}
                  onChangeText={(text) => handleFormChange("inventoryId", text)}
                  style={styles.input}
                />
                <Text style={styles.label}>Product Id</Text>
                <TextInput
                  value={form.productId}
                  onChangeText={(text) => handleFormChange("productId", text)}
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

export default InventoryProduct;
