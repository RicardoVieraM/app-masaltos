import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { useCart } from "./CartContext";

export default function Cart() {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  const { cartItems, setCartItems, removeFromCart } = useCart();

  const updateQuantity = (itemId, size, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );
  const impuestos = subtotal * 0.105;
  const total = subtotal;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Carrito</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.sizeText}>{item.size}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                {Number(item.price) && !isNaN(item.price)
                  ? (parseFloat(item.price) * item.quantity).toFixed(2) + " €"
                  : "Precio no disponible"}
              </Text>

              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.size, -1)}
                >
                  <Feather name="minus" size={18} color="#C55417" />
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.size, 1)}
                >
                  <Feather name="plus" size={18} color="#C55417" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.trashIcon}
              onPress={() => removeFromCart(item.id)}
            >
              <Feather name="trash-2" size={24} color="#C4C4C4" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>{subtotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Transporte</Text>
            <Text style={styles.freeText}>Gratis</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Impuestos incluidos</Text>
            <Text style={styles.summaryText}>{impuestos.toFixed(2)} €</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>{total.toFixed(2)} €</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() =>
              navigation.navigate("checkout", {
                subtotal: subtotal.toFixed(2),
                impuestos: impuestos.toFixed(2),
                total: total.toFixed(2),
              })
            }
          >
            <Text style={styles.checkoutText}>Finalizar pago</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
    marginTop: 10,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerIcon: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 25,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    position: "relative",
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  productName: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  productPrice: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  sizeText: {
    position: "absolute",
    top: 0,
    right: 0,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#555",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  qtyBtn: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  qtyNumber: {
    marginHorizontal: 10,
    fontFamily: "Montserrat_500Medium",
  },
  trashIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  summary: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#333",
  },
  freeText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#4CAF50",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
  },
  checkoutBtn: {
    backgroundColor: "#C55417",
    borderRadius: 30,
    paddingVertical: 16,
    marginTop: 20,
  },
  checkoutText: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
    textAlign: "center",
  },
});
