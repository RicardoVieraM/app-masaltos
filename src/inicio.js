import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_STORAGE_KEY = "@profile_image_url";

const categories = [
  { name: "Botas", image: require("../assets/botas.png") },
  { name: "Novios", image: require("../assets/novios.png") },
  { name: "Sneakers", image: require("../assets/sneakers.png") },
  { name: "Casual", image: require("../assets/casual.png") },
  { name: "Vestir", image: require("../assets/vestir.png") },
  { name: "Mocasines", image: require("../assets/mocasines.png") },
  { name: "Goodyear", image: require("../assets/goodyear.png") },
  { name: "Complementos", image: require("../assets/complementos.png") },
];

export default function HomeScreen() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const [userName, setUserName] = useState(route.params?.userName || "Usuario");
  const [userImage, setUserImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const navigation = useNavigation();
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [destacados, setDestacados] = useState([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);
  const [nuevos, setNuevos] = useState([]);
  const [loadingNuevos, setLoadingNuevos] = useState(true);
  const nuevosRef = useRef(null);
  const [nuevosIndex, setNuevosIndex] = useState(0);
  const carruselInterval = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getDestacados = async () => {
      try {
        setLoadingDestacados(true);

        const res = await fetch(
          "https://pruebas.masaltos.com/api/categories/2?ws_key=YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416&output_format=JSON"
        );
        const data = await res.json();
        const productos = data.category.associations.products;
        const primeros15 = productos.slice(0, 15);

        const detalles = await Promise.all(
          primeros15.map(async (prod) => {
            const r = await fetch(
              `https://pruebas.masaltos.com/api/products/${prod.id}?ws_key=YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416&output_format=JSON`
            );
            const d = await r.json();
            return d.product;
          })
        );

        const filtrados = detalles.filter((p) => p.active === "1");
        setDestacados(filtrados);
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
      } finally {
        setLoadingDestacados(false);
      }
    };

    const getNuevos = async () => {
      try {
        setLoadingNuevos(true);

        const res = await fetch(
          "https://pruebas.masaltos.com/api/products?ws_key=YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416&output_format=JSON"
        );
        const data = await res.json();
        const productos = data.products.slice(0, 10);

        const detalles = await Promise.all(
          productos.map(async (prod) => {
            const r = await fetch(
              `https://pruebas.masaltos.com/api/products/${prod.id}?ws_key=YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416&output_format=JSON`
            );
            const d = await r.json();
            return d.product;
          })
        );

        const nuevosFiltrados = detalles
          .filter((p) => p.condition === "new" && p.active === "1")
          .slice(0, 10);

        setNuevos(nuevosFiltrados);
      } catch (error) {
        console.error("Error cargando productos nuevos:", error);
      } finally {
        setLoadingNuevos(false);
      }
    };

    getDestacados();
    getNuevos();
  }, []);

  useEffect(() => {
    if (!loadingNuevos && nuevos.length > 0) {
      startAutoScroll();
    }

    return () => {
      if (carruselInterval.current) {
        clearInterval(carruselInterval.current);
      }
    };
  }, [loadingNuevos, nuevos]);

  const getNombreProducto = (nameArray) => {
    if (!Array.isArray(nameArray)) return "Sin nombre";
    const nombreES = nameArray.find((n) => n.id === 1 || n.id === "1");
    return nombreES?.value || nameArray[0]?.value || "Sin nombre";
  };

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -250,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleCategoryPress = (categoryName) => {
    navigation.navigate("catalogo", { selectedCategory: categoryName });
  };

  useFocusEffect(
    useCallback(() => {
      const loadImage = async () => {
        try {
          const storedImage = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
          if (storedImage) {
            setUserImage(storedImage);
          }
          setIsLoaded(true);
        } catch (error) {
          console.log(
            "Error al cargar la imagen del almacenamiento local: ",
            error
          );
        }
      };

      loadImage();
    }, [userImage])
  );

  const startAutoScroll = () => {
    if (carruselInterval.current) clearInterval(carruselInterval.current);

    carruselInterval.current = setInterval(() => {
      setNuevosIndex((prev) => {
        const next = (prev + 1) % nuevos.length;
        nuevosRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
  };

  const destacadosConExtra = [
    ...destacados,
    { id: "ver-todos", esVerTodos: true },
  ];

  return (
    <View style={styles.container}>
      {menuVisible && (
        <Animated.View
          style={[styles.sideMenu, { left: slideAnim, opacity: opacityAnim }]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          {isLoaded && (
            <Image
              source={
                userImage ? { uri: userImage } : require("../assets/pfp.png")
              }
              style={styles.userImage}
            />
          )}
          <Text style={styles.menuGreeting}>Hola,</Text>
          <Text style={styles.menuUser}>{userName}</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("perfil")}
          >
            <View style={styles.menuItemContent}>
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color="black"
              />
              <Text style={styles.menuText}>Perfil</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <AntDesign name="home" size={24} color="#C55417" />
              <Text style={styles.menuCurrentText}>Home</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("catalogo")}
          >
            <View style={styles.menuItemContent}>
              <Feather name="calendar" size={24} color="black" />
              <Text style={styles.menuText}>Catálogo</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("pedidos")}
          >
            <View style={styles.menuItemContent}>
              <MaterialCommunityIcons
                name="truck-fast-outline"
                size={24}
                color="black"
              />
              <Text style={styles.menuText}>Pedidos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("notifications")}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name="notifications-outline" size={24} color="black" />
              <Text style={styles.menuText}>Notificaciones</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("settings")}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name="settings-outline" size={24} color="black" />
              <Text style={styles.menuText}>Configuración</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.menuSeparator} />
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="log-out-outline" size={24} color="black" />
              <Text style={styles.menuText}>Salir</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("contactanos")}
          >
            <View style={styles.menuItemContent}>
              <FontAwesome6 name="users" size={20} color="black" />
              <Text style={styles.menuText}>Contáctanos</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Feather
            style={styles.headerIcon}
            name="menu"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Image
          source={require("../assets/logo-masaltos.png")}
          style={styles.logo}
        />
        <TouchableOpacity onPress={() => navigation.navigate("cart")}>
          <Feather
            style={styles.headerIcon}
            name="shopping-bag"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#707B81" />
        <TextInput
          style={styles.searchInput}
          placeholder="Búsqueda en el catálogo..."
        />
      </View>

      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ top: true }, ...categories]}
          keyExtractor={(item, index) => item.name || `top-${index}`}
          renderItem={({ item }) =>
            item.top ? (
              <TouchableOpacity
                style={styles.top}
                onPress={() =>
                  navigation.navigate("catalogo", { selectedCategory: "Top" })
                }
              >
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color="red"
                  style={styles.iconLeft}
                />
                <Text style={styles.topText}>Top</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleCategoryPress(item.name)}>
                <View
                  style={[
                    styles.categoryItem,
                    selectedCategory === item.name && { opacity: 0.5 },
                  ]}
                >
                  <Image source={item.image} style={styles.categoryImage} />
                  <Text style={styles.categoryText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )
          }
          contentContainerStyle={styles.categoriesContainer}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
            paddingHorizontal: 5,
          }}
        >
          <Text style={styles.sectionTitle}>Zapatos populares</Text>
          <TouchableOpacity>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {loadingDestacados ? (
          <ActivityIndicator
            size="large"
            color="#C55417"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <>
            <FlatList
              horizontal
              data={destacadosConExtra}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={5}
              renderItem={({ item }) =>
                item.esVerTodos ? (
                  <TouchableOpacity
                    style={{
                      width: 120,
                      height: 230,
                      borderRadius: 15,
                      marginRight: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => navigation.navigate("catalogo")}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                        color: "#C55417",
                        fontSize: 16,
                        marginBottom: 10,
                      }}
                    >
                      Ver todos
                    </Text>
                    <Feather name="arrow-right" size={24} color="#C55417" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.productCard}
                    onPress={() =>
                      navigation.navigate("details", { producto: item })
                    }
                  >
                    <Image
                      source={{
                        uri: `https://pruebas.masaltos.com/api/images/products/${item.id}/${item.id_default_image}?ws_key=YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416`,
                      }}
                      style={styles.productImage}
                      defaultSource={require("../assets/img1.png")}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.desc}>BEST SELLER</Text>
                      <Text style={styles.productTitle}>
                        {getNombreProducto(item.name)}
                      </Text>
                      <Text style={styles.productPrice}>
                        {parseFloat(item.price).toFixed(2)} €
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.add}>
                      <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )
              }
              style={styles.popularShoes}
            />
          </>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
            paddingHorizontal: 5,
          }}
        >
          <Text style={styles.sectionTitle}>Nuevos</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("catalogo", { selectedCategory: "Top" })
            }
          >
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {loadingNuevos ? (
          <ActivityIndicator
            size="large"
            color="#C55417"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <>
            <FlatList
              horizontal
              pagingEnabled
              ref={nuevosRef}
              data={nuevos}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x /
                    event.nativeEvent.layoutMeasurement.width
                );
                setNuevosIndex(newIndex);
                Animated.timing(progressAnim, {
                  toValue: newIndex,
                  duration: 300,
                  useNativeDriver: false,
                }).start();
                startAutoScroll();
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.lastProductCard}
                  onPress={() =>
                    navigation.navigate("details", { producto: item })
                  }
                >
                  <View>
                    <Text style={styles.desc}>BEST CHOICE</Text>
                    <Text style={styles.productTitle}>
                      {getNombreProducto(item.name)}
                    </Text>
                    <Text style={styles.productPrice}>
                      {parseFloat(item.price).toFixed(2)} €
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: `https://pruebas.masaltos.com/api/images/products/${item.id}/${item.id_default_image}?ws_key=YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416`,
                    }}
                    style={styles.lastProductImage}
                  />
                </TouchableOpacity>
              )}
              style={styles.popularShoes}
            />

            {/* Barra de progreso animada */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {nuevos.map((_, index) => {
                const width = progressAnim.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [8, 20, 8],
                  extrapolate: "clamp",
                });

                const backgroundColor = progressAnim.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: ["#ccc", "#C55417", "#ccc"],
                  extrapolate: "clamp",
                });

                return (
                  <Animated.View
                    key={index}
                    style={{
                      width,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor,
                      marginHorizontal: 4,
                    }}
                  />
                );
              })}
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.floatingCart}
        onPress={() =>
          navigation.navigate("catalogo")
        }
      >
        <Feather name="calendar" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavIcon}>
          <AntDesign name="home" size={24} color="#C55417" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavIcon}
          onPress={() => navigation.navigate("pedidos")}
        >
          <MaterialCommunityIcons
            name="truck-fast-outline"
            size={24}
            color="#707B81"
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 70 }} />
        <TouchableOpacity
          style={styles.bottomNavIcon}
          onPress={() => navigation.navigate("notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color="#707B81" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavIcon}
          onPress={() => navigation.navigate("perfil")}
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={24}
            color="#707B81"
          />
        </TouchableOpacity>
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  headerIcon: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 25,
  },
  logo: {
    width: 180,
    height: 50,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 400,
    backgroundColor: "#fcecdf",
    padding: 20,
    paddingTop: 50,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  menuGreeting: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 10,
  },
  menuUser: {
    fontSize: 25,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 30,
  },
  menuItem: {
    paddingVertical: 15,
    marginLeft: 10,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    marginLeft: 20,
  },
  menuCurrentText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    marginLeft: 20,
    color: "#C55417",
  },
  menuSeparator: {
    height: 3,
    backgroundColor: "black",
    marginVertical: 10,
    marginLeft: 10,
    marginRight: 150,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 5,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    paddingLeft: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontFamily: "Montserrat_400Regular",
  },
  categories: {
    flexDirection: "row",
    marginBottom: 20,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C55417",
    padding: 5,
    borderRadius: 50,
    marginRight: 10,
    width: 90,
    height: 50,
    justifyContent: "center",
  },
  topText: {
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },
  iconLeft: {
    marginRight: 5,
    backgroundColor: "#ffd1b8",
    padding: 2,
    borderRadius: 20,
  },
  category: {
    backgroundColor: "#EAEAEA",
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 10,
    textAlign: "center",
  },
  categoriesAndPopular: {
    marginBottom: 20,
  },
  popularShoes: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
    marginBottom: 8,
  },
  productCard: {
    backgroundColor: "#fff",
    width: 170,
    height: 230,
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
    position: "relative",
    justifyContent: "flex-start",
  },
  productImage: {
    width: 150,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  desc: {
    color: "#C55417",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    marginBottom: 10,
    backgroundColor: "#ffe3d2",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: "hidden",
  },
  productTitle: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
    marginBottom: 10,
  },
  productPrice: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#707B81",
  },
  add: {
    backgroundColor: "#C55417",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    width: 35,
    height: 35,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  addText: {
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
    fontSize: 25,
    textAlign: "center",
  },
  lastProductCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 150,
    width: 350,
    padding: 20,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  lastProductImage: {
    width: 200,
    height: 130,
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "113%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 1,
  },
  floatingCart: {
    position: "absolute",
    bottom: 35,
    alignSelf: "center",
    backgroundColor: "#C55417",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomNavCatalogIcon: {
    padding: 20,
    backgroundColor: "#C55417",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -20 }],
  },
  bottomNavIcon: {
    padding: 25,
  },
  verTodos: {
    fontFamily: "Montserrat_400Regular",
    color: "#C55417",
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 10,
  },
  productInfo: {
    justifyContent: "flex-end",
    flex: 1,
  },
});
