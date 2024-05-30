import { Text, View, StyleSheet, Modal, TouchableOpacity, TextInput } from "react-native";
import { useState, useCallback } from "react";
import {
  createInventory,
  getAllInventories,
} from "../../services/InventoryServices";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import { CustomButton, AppLoader } from "../../components";
import { FlatList } from "react-native-gesture-handler";
import { Card } from "react-native-paper";

// Inventory Page
// Author: Pham Hien Nhan
const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const { token } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    maxVolume: "",
  });

  // Fetch data for inventory
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get all inventories
      const res = await getAllInventories(token);
      setInventories(res.result);
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

  // Handle form change
  const handleFormChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Handle form submit
  const handleFormSubmit = async () => {
    try {
      const newInventory = {
        name: form.name,
        address: form.address,
        maxVolume: form.maxVolume,
      };
      const res = await createInventory(token, newInventory);
      setInventories([...inventories, res.result]);
      setFormModalVisible(false);
      setForm({
        name: "",
        address: "",
        maxVolume: "",
      });
    } catch (err) {
      // handle error, e.g., show a message to the user
    }
  };

  return (
    <>
      <View style={styles.container}>
        {inventories.length > 0 ? (
          <View style={{ maxHeight: 7 * 80 }}>
            <FlatList
              data={inventories.slice().sort((a, b) => a.id - b.id)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Card
                  style={styles.card}
                >
                  <Card.Title
                    title={"Inventory .No: " + item.id}
                    titleStyle={styles.title}
                  />
                  <Card.Content>
                    <Text className="flex text-lg font-psemi text-black">
                      Name: {item.name}
                    </Text>
                    <Text className="flex text-lg font-psemi text-black">
                      Address : {item.address}
                    </Text>
                    <Text className="flex text-lg font-psemi text-black">
                      Max Volume : {item.maxVolume}
                    </Text>
                  </Card.Content>
                </Card>
              )}
            />

            <CustomButton
              icon={"plus"}
              iconSize={28}
              containerStyles="p-0 absolute bottom-6 self-end right-4 h-12 w-12 rounded-full bg-green-500 items-center justify-center"
              isLoading={false}
              handlePress={() => {
                setForm({
                  address: "",
                  name: "",
                  maxVolume: "",
                });
                setFormModalVisible(true);
              }}
            />
          </View>
        ) : (
          <View
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20 }}>
              No Inventory Available
            </Text>
          </View>
        )}
      </View>
      {loading ? <AppLoader /> : null}

      <Modal
        visible={formModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFormModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Inventory</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={form.name}
              onChangeText={(text) => handleFormChange("name", text)}
              style={styles.input}
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
              value={form.address}
              onChangeText={(text) => handleFormChange("address", text)}
              style={styles.input}
            />
            <Text style={styles.label}>Max volume</Text>
            <TextInput
              value={form.maxVolume}
              onChangeText={(text) => handleFormChange("maxVolume", text)}
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
  title: {
    color: "#FFA500",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
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

export default Inventory;
