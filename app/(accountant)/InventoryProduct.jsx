import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { getAllInventoryProducts } from "../../services/InventoryServices";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import AppLoader from "../../components/AppLoader";
import { LeftSwipe, RightSwipe } from "../../components";

const InventoryProduct = () => {
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const { token } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
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

  const handleSwipeItemPress = (title) => {
    console.log(title);
  };

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
            <LeftSwipe onPressItem={handleSwipeItemPress} />
          )}
          renderRightActions={() => (
            <RightSwipe onPressItem={handleSwipeItemPress} />
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
      </View>
      {loading ? <AppLoader /> : null}
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
});

export default InventoryProduct;