import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator,
  FlatList,
  PanResponder,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";

const categories = [
  { name: "Botas", text: "Botas", image: require("../assets/botas.png") },
  {
    name: "Zapatos para novio",
    text: "Novios",
    image: require("../assets/novios.png"),
  },
  {
    name: "Sneakers corner",
    text: "Sneakers",
    image: require("../assets/sneakers.png"),
  },
  {
    name: "Zapatos casual",
    text: "Casual",
    image: require("../assets/casual.png"),
  },
  {
    name: "Zapatos de vestir",
    text: "Vestir",
    image: require("../assets/vestir.png"),
  },
  {
    name: "Mocasines",
    text: "Mocasines",
    image: require("../assets/mocasines.png"),
  },
  {
    name: "Zapatos Goodyear",
    text: "Goodyear",
    image: require("../assets/goodyear.png"),
  },
  {
    name: "Complementos Calzado",
    text: "Complementos",
    image: require("../assets/complementos.png"),
  },
];

const colorMap = {
  5: "#AAB2BD",
  6: "#CFC4A6",
  7: "#f5f5dc",
  8: "#ffffff",
  9: "#faebd7",
  10: "#E84C3D",
  11: "#434A54",
  12: "#C19A6B",
  13: "#F39C11",
  14: "#5D9CEC",
  15: "#A0D468",
  16: "#F1C40F",
  17: "#964B00",
  18: "#FCCACD",
  44: "#641c34",
  45: "#800000",
};

const ITEMS_PER_PAGE = 10;

export default function Catalogo() {
  const navigation = useNavigation();
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});
  const categoryMapRef = useRef({});
  const currentPageRef = useRef(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState(20);
  const [maxPrice, setMaxPrice] = useState(350);
  const allProductsCache = useRef(null);
  const destacadosCache = useRef(null);

  const baseURL = "https://pruebas.masaltos.com/api";
  const authHeader = "Basic " + btoa("YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416:");
  const headers = { Authorization: authHeader };

  const route = useRoute();

  const initialCategory = useRef(route.params?.selectedCategory || null);

  const filterByCategory = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory(null);
      setFilteredProducts(null);
      setVisibleProducts([]);
      setTimeout(() => {
        setVisibleProducts(allProducts.slice(0, 10));
      }, 0);
      setPage(2);
      currentPageRef.current = 2;
    } else {
      const filtered = allProducts.filter((product) => {
        const categories = product.productType || [];
        return categories.some(
          (cat) =>
            cat.toLowerCase().includes(category.toLowerCase()) ||
            category.toLowerCase().includes(cat.toLowerCase())
        );
      });
      setSelectedCategory(category);
      setFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, 10));
      setPage(2);
      currentPageRef.current = 2;
    }
  };

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  const getPublicImageUrl = (imageId) => {
    const digits = imageId.toString().split("");
    const path = digits.join("/");
    return `https://pruebas.masaltos.com/img/p/${path}/${imageId}.jpg`;
  };

  const fetchDestacados = async () => {
    try {
      const res = await fetch(
        `${baseURL}/categories/2?ws_key=YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416&output_format=JSON`
      );
      const data = await res.json();
      const productos = data.category.associations.products;

      const detalles = await Promise.all(
        productos.map(async (prod) => {
          const r = await fetch(
            `${baseURL}/products/${prod.id}?output_format=JSON`,
            { headers }
          );
          const d = await r.json();
          return d.product;
        })
      );

      // Filtra los activos
      const activos = detalles.filter((p) => p.active === "1");

      // Mapea a objetos de producto compatibles
      const destacados = activos.map((prod) => {
        const name = Array.isArray(prod.name)
          ? prod.name[0]?.value || "Sin nombre"
          : typeof prod.name === "string"
          ? prod.name
          : Object.values(prod.name)[0]?.value || "Sin nombre";

        const price = parseFloat(prod.price);
        const idImage = prod.id_default_image
          ? parseInt(prod.id_default_image)
          : null;

        const colors =
          prod.associations?.product_option_values?.map((opt) =>
            parseInt(opt.id)
          ) || [];

        // Crea los IDs de categoría 
        const categoryIds = new Set();
        const rawCategories = prod?.associations?.categories;
        if (rawCategories) {
          let categoryArray = [];
          if (Array.isArray(rawCategories)) {
            categoryArray = rawCategories;
          } else if (Array.isArray(rawCategories.category)) {
            categoryArray = rawCategories.category;
          } else if (rawCategories.category) {
            categoryArray = [rawCategories.category];
          }
          categoryArray.forEach((cat) => {
            if (cat.id) categoryIds.add(cat.id.toString().trim());
          });
        }
        if (prod.id_category_default) {
          categoryIds.add(prod.id_category_default.toString().trim());
        }

        const productType = Array.from(categoryIds)
          .map((id) => categoryMapRef.current?.[id])
          .filter(Boolean);

        return {
          id: prod.id,
          name,
          price: `${price.toFixed(2)} €`,
          imageUrl: idImage
            ? `https://pruebas.masaltos.com/img/p/${idImage
                .toString()
                .split("")
                .join("/")}/${idImage}.jpg`
            : null,
          colors,
          productType,
          categoryIds: Array.from(categoryIds),
        };
      });

      return destacados;
    } catch (error) {
      console.error("❌ Error al cargar destacados:", error);
      return [];
    }
  };

  const fetchCategoryMap = async () => {
    const res = await fetch(
      `${baseURL}/categories?display=[id,name,id_parent]&output_format=JSON`,
      { headers }
    );
    const data = await res.json();
    const map = Object.fromEntries(
      data.categories.map((cat) => {
        let name = "Sin nombre";
        if (Array.isArray(cat.name)) {
          name = cat.name[0]?.value || "Sin nombre";
        } else if (typeof cat.name === "object" && cat.name !== null) {
          name = Object.values(cat.name)[0]?.value || "Sin nombre";
        } else if (typeof cat.name === "string") {
          name = cat.name;
        }
        return [cat.id, name];
      })
    );

    setCategoryMap(map);
    categoryMapRef.current = map;
    return map;
  };

  const extractCategoryNames = (product, categoryMapRef) => {
    const categoryIds = new Set();

    const rawCategories = product?.associations?.categories;

    if (rawCategories) {
      let categoryArray = [];
      if (Array.isArray(rawCategories)) {
        categoryArray = rawCategories;
      } else if (Array.isArray(rawCategories.category)) {
        categoryArray = rawCategories.category;
      } else if (rawCategories.category) {
        categoryArray = [rawCategories.category];
      }
      categoryArray.forEach((cat) => {
        if (cat.id) categoryIds.add(cat.id.toString().trim());
      });
    }

    if (product.id_category_default) {
      categoryIds.add(product.id_category_default.toString().trim());
    }

    const categoryNames = Array.from(categoryIds)
      .map((id) => categoryMapRef[id])
      .filter(Boolean);

    return categoryNames;
  };

  const fetchProducts = async () => {
    const res = await fetch(
      `${baseURL}/products?display=full&output_format=JSON`,
      { headers }
    );
    const data = await res.json();
    return data.products || [];
  };

  const fetchCombinationDetail = async (id) => {
    const res = await fetch(
      `${baseURL}/combinations/${id}?output_format=JSON`,
      { headers }
    );
    const data = await res.json();
    return data.combination;
  };

  const fetchOptionValueName = async (id) => {
    const res = await fetch(
      `${baseURL}/product_option_values/${id}?output_format=JSON`,
      { headers }
    );
    const data = await res.json();
    return data.product_option_value?.name?.[0]?.value || null;
  };

  const groupCache = {};

  const fetchGroupName = async (groupId) => {
    if (groupCache[groupId]) return groupCache[groupId];

    try {
      const res = await fetch(
        `${baseURL}/product_option_groups/${groupId}?output_format=JSON`,
        { headers }
      );
      const data = await res.json();
      const name = data?.product_option_group?.name?.[0]?.value?.trim() || null;
      groupCache[groupId] = name;
      return name;
    } catch (err) {
      console.warn(`❌ Error fetch group ${groupId}:`, err);
      return null;
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          Animated.timing(slideAnim, {
            toValue: -300,
            duration: 300,
            useNativeDriver: false,
          }).start(() => setShowFilter(false));
        }
      },
    })
  ).current;

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchCategoryMap();

      const destacados = await fetchDestacados();
      destacadosCache.current = destacados;

      let cleaned = allProductsCache.current;

      if (!cleaned) {
        const rawProducts = await fetchProducts();

        const detailed = await Promise.all(
          rawProducts.map(async (prod) => {
            try {
              let name = "Sin nombre";
              if (Array.isArray(prod.name)) {
                name = prod.name[0]?.value || "Sin nombre";
              } else if (typeof prod.name === "object" && prod.name !== null) {
                name = Object.values(prod.name)[0]?.value || "Sin nombre";
              } else if (typeof prod.name === "string") {
                name = prod.name;
              }

              const price = parseFloat(prod.price);
              if (isNaN(price)) return null;

              const idImage = prod.id_default_image
                ? parseInt(prod.id_default_image)
                : null;
              const imageUrl = idImage ? getPublicImageUrl(idImage) : null;
              const productType = extractCategoryNames(
                prod,
                categoryMapRef.current
              );
              const categoryIds = new Set();

              const rawCategories = prod?.associations?.categories;
              if (rawCategories) {
                let categoryArray = [];
                if (Array.isArray(rawCategories)) {
                  categoryArray = rawCategories;
                } else if (Array.isArray(rawCategories.category)) {
                  categoryArray = rawCategories.category;
                } else if (rawCategories.category) {
                  categoryArray = [rawCategories.category];
                }
                categoryArray.forEach((cat) => {
                  if (cat.id) categoryIds.add(cat.id.toString().trim());
                });
              }

              if (prod.id_category_default) {
                categoryIds.add(prod.id_category_default.toString().trim());
              }

              const productColors =
                prod.associations?.product_option_values?.map((opt) =>
                  parseInt(opt.id)
                ) || [];

              return {
                id: prod.id,
                name,
                price: `${price.toFixed(2)} €`,
                imageUrl,
                productType,
                colors: productColors,
                categoryIds: Array.from(categoryIds),
              };
            } catch (e) {
              console.warn("❌ Error procesando producto:", prod.id, e);
              return null;
            }
          })
        );

        cleaned = detailed.filter((p) => p !== null);
        allProductsCache.current = cleaned;
      }

      setAllProducts(cleaned);

      if (initialCategory.current) {
        const filtered = cleaned.filter((product) => {
          const categories = product.productType || [];
          return categories.some(
            (cat) =>
              cat
                .toLowerCase()
                .includes(initialCategory.current.toLowerCase()) ||
              initialCategory.current.toLowerCase().includes(cat.toLowerCase())
          );
        });

        setSelectedCategory(initialCategory.current);
        setFilteredProducts(filtered);
        setVisibleProducts(filtered.slice(0, ITEMS_PER_PAGE));
        initialCategory.current = null;
      } else {
        setFilteredProducts(null);
        setVisibleProducts(cleaned.slice(0, ITEMS_PER_PAGE));
      }

      setPage(2);
      currentPageRef.current = 2;
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const loadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    const sourceArray = filteredProducts || allProducts;

    const start = (currentPageRef.current - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const nextProducts = sourceArray.slice(start, end);

    if (nextProducts.length > 0) {
      setVisibleProducts((prev) => [...prev, ...nextProducts]);
      setPage((prev) => prev + 1);
      currentPageRef.current += 1;
    }

    setIsLoadingMore(false);
  };

  const toggleFilter = () => {
    if (showFilter) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowFilter(false));
    } else {
      setShowFilter(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  const toggleColor = (color) => {
    setSelectedColors((prev) => {
      const updated = prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color];

      if (updated.length === 0) {
        setFilteredProducts(null);
        setVisibleProducts(allProducts.slice(0, ITEMS_PER_PAGE));
        setPage(2);
        currentPageRef.current = 2;
        return updated;
      }

      const colorIdMap = {
        Gris: 5,
        "Gris pardo": 6,
        Beige: 7,
        Blanco: 8,
        "Blanco roto": 9,
        Rojo: 10,
        Negro: 11,
        Camel: 12,
        Naranja: 13,
        Azul: 14,
        Verde: 15,
        Amarillo: 16,
        Marrón: 17,
        Rosa: 18,
        Burdeos: 44,
        Borgoña: 45,
      };

      const selectedColorIds = updated
        .map((name) => colorIdMap[name])
        .filter(Boolean);

      const filtered = allProducts.filter((product) =>
        product.colors?.some((id) => selectedColorIds.includes(id))
      );

      setFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, ITEMS_PER_PAGE));
      setPage(2);
      currentPageRef.current = 2;

      return updated;
    });
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleTopPress = async () => {
    if (!allProducts || allProducts.length === 0) return;

    if (selectedCategory === "Top") {
      setSelectedCategory(null);
      setFilteredProducts(null);
      setVisibleProducts(allProducts.slice(0, ITEMS_PER_PAGE));
      setPage(2);
      currentPageRef.current = 2;
    } else {
      let topFiltered = destacadosCache.current;

      if (!topFiltered) {
        topFiltered = await fetchDestacados();
        destacadosCache.current = topFiltered;
      }

      setSelectedCategory("Top");
      setFilteredProducts(topFiltered);
      setVisibleProducts(topFiltered.slice(0, ITEMS_PER_PAGE));
      setPage(2);
      currentPageRef.current = 2;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={styles.container}
        data={visibleProducts}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate("details", { producto: item })}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.productImage}
            />
            <Text style={styles.productName}>{item.name}</Text>

            <View style={styles.priceColorsRow}>
              <Text style={styles.productPrice}>{item.price}</Text>
              <View style={styles.colorOptions}>
                {item.colors
                  ?.filter((colorId) => colorMap[colorId])
                  .map((colorId, index) => (
                    <View
                      key={index}
                      style={[
                        styles.colorDot,
                        {
                          backgroundColor: colorMap[colorId],
                          borderWidth: 1,
                          borderColor: "#ccc",
                        },
                      ]}
                    />
                  ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.goBack()}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <Text style={styles.category}>Catálogo</Text>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.navigate("cart")}
              >
                <Feather name="shopping-bag" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={toggleFilter}
            >
              <View style={styles.filterButtonContent}>
                <AntDesign name="filter" size={15} color="#707B81" />
                <Text style={styles.filterButtonText}>Filtrar</Text>
              </View>
            </TouchableOpacity>

            <FlatList
              data={[{ top: true }, ...categories]}
              keyExtractor={(item, index) => item.name || `top-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              renderItem={({ item }) =>
                item.top ? (
                  <TouchableOpacity onPress={handleTopPress}>
                    <View
                      style={[
                        styles.categoryItem,
                        selectedCategory === "Top" && { opacity: 0.5 },
                      ]}
                    >
                      <View style={styles.topCircle}>
                        <MaterialCommunityIcons
                          name="fire"
                          size={30}
                          color="red"
                        />
                      </View>
                      <Text style={styles.categoryText}>Top</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => filterByCategory(item.name)}>
                    <View
                      style={[
                        styles.categoryItem,
                        selectedCategory === item.name && { opacity: 0.5 },
                      ]}
                    >
                      <Image source={item.image} style={styles.categoryImage} />
                      <Text style={styles.categoryText}>{item.text}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }
            />
          </>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore && (
            <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
          )
        }
      />

      {showFilter && (
        <Animated.View style={[styles.slidePanel, { bottom: slideAnim }]}>
          <View style={styles.handleBar} {...panResponder.panHandlers} />
          <View style={styles.panelHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity style={styles.clearButton} onPress={toggleFilter}>
              <Text style={styles.clearText}>BORRAR</Text>
            </TouchableOpacity>
          </View>

          <View>
            {/* Filtro por Color */}
            <Text style={styles.filterTitle}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterGroup}>
                {[
                  "Gris",
                  "Gris pardo",
                  "Beige",
                  "Blanco",
                  "Blanco roto",
                  "Rojo",
                  "Negro",
                  "Camel",
                  "Naranja",
                  "Azul",
                  "Verde",
                  "Amarillo",
                  "Marrón",
                  "Rosa",
                  "Burdeos",
                  "Borgoña",
                ].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.filterOption,
                      selectedColors.includes(color) && styles.selectedOption,
                    ]}
                    onPress={() => toggleColor(color)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedColors.includes(color) && styles.selectedText,
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Filtro por Talla */}
            <Text style={styles.filterTitle}>Talla</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterGroup}>
                {[
                  "37",
                  "38",
                  "39",
                  "40",
                  "41",
                  "42",
                  "43",
                  "44",
                  "45",
                  "46",
                  "47",
                  "S",
                  "M",
                  "L",
                ].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.filterOption,
                      selectedSizes.includes(size) && styles.selectedOption,
                    ]}
                    onPress={() => toggleSize(size)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedSizes.includes(size) && styles.selectedText,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Filtro por Precio */}
            <Text style={styles.filterTitle}>Precio</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>20€</Text>
              <View style={styles.sliderLine} />
              <Text style={styles.sliderLabel}>350€</Text>
            </View>

            {/* Botón Aplicar */}
            <TouchableOpacity
              style={[styles.button, { alignSelf: "center", marginTop: 20 }]}
            >
              <Text style={styles.buttonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
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
  category: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
  },
  headerIcon: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 25,
  },
  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 25,
    alignSelf: "center",
    marginBottom: 20,
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonText: {
    fontFamily: "Montserrat_400Regular",
    color: "#707B81",
    fontSize: 14,
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    flexDirection: "column",
    display: "flex",
    justifyContent: "space-between",
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontFamily: "Montserrat_500Medium",
    color: "#C55417",
    fontSize: 14,
    marginBottom: 5,
  },
  productDescription: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 8,
    marginBottom: 5,
  },
  priceColorsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  productPrice: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  colorOptions: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginLeft: 5,
  },
  slidePanel: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    paddingBottom: 40,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  panelHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  clearButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
    color: "#1D1D1D",
  },
  clearText: {
    color: "#707B81",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#C55417",
    width: 200,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#1D1D1D",
    marginBottom: 10,
  },
  filterGroup: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 10,
    marginBottom: 20,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#E6EAEA",
    borderRadius: 20,
  },
  filterOptionText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#1D1D1D",
  },
  selectedOption: {
    backgroundColor: "#C55417",
  },
  selectedText: {
    color: "#fff",
  },
  sliderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  sliderLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  sliderLine: {
    height: 4,
    backgroundColor: "#ccc",
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 2,
  },
  topButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C55417",
    paddingHorizontal: 10,
    borderRadius: 50,
    marginRight: 10,
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
  topCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffd1b8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderWidth: 3,
    borderColor: "#C55417",
  },
});
