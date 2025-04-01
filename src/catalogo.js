import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';

const categories = [
  { name: 'Botas', text:'Botas', image: require('../assets/botas.png') },
  { name: 'Zapatos para novio', text:'Novios', image: require('../assets/novios.png') },
  { name: 'Sneakers corner', text:'Sneakers', image: require('../assets/sneakers.png') },
  { name: 'Zapatos casual', text:'Casual', image: require('../assets/casual.png') },
  { name: 'Zapatos de vestir', text:'Vestir', image: require('../assets/vestir.png') },
  { name: 'Mocasines', text:'Mocasines', image: require('../assets/mocasines.png') },
  { name: 'Zapatos Goodyear', text:'Goodyear', image: require('../assets/goodyear.png') },
];

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

  const baseURL = 'https://pruebas.masaltos.com/api';
  const authHeader = 'Basic ' + btoa('YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416:');
  const headers = { Authorization: authHeader };

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium
  });

  const getPublicImageUrl = (imageId) => {
    const digits = imageId.toString().split('');
    const path = digits.join('/');
    return `https://pruebas.masaltos.com/img/p/${path}/${imageId}.jpg`;
  };

  const fetchCategoryMap = async () => {
    const res = await fetch(`${baseURL}/categories?display=[id,name,id_parent]&output_format=JSON`, { headers });
    const data = await res.json();
    const map = Object.fromEntries(data.categories.map(cat => [cat.id, cat.name[0]?.value || '']));
    setCategoryMap(map);
    return map;
  };

  const extractCategoryNames = (product, categoryMapRef) => {
    const categoryIds = new Set();
  
    // Obtener categorías asociadas dentro de <associations><categories>
    if (product.associations?.categories?.category) {
      const associatedCategories = Array.isArray(product.associations.categories.category)
        ? product.associations.categories.category
        : [product.associations.categories.category];
      
      associatedCategories.forEach(cat => {
        if (cat.id) categoryIds.add(cat.id.toString().trim());
      });
    }
  
    // Agregar la categoría por defecto si existe
    if (product.id_category_default) {
      categoryIds.add(product.id_category_default.toString().trim());
    }
  
    // Convertir los IDs a nombres de categorías usando categoryMapRef
    const categoryNames = Array.from(categoryIds)
      .map(id => categoryMapRef[id])
      .filter(Boolean); // Esto asegura que solo se agreguen nombres válidos
  
    return categoryNames; // Devolver SIEMPRE un array
  };  
  
  
  const fetchProductsByPage = async (pageNumber, categoryMapRef) => {
    try {
      const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
      const productRes = await fetch(`${baseURL}/products?display=[id,name,id_category_default]&limit=${ITEMS_PER_PAGE}&offset=${offset}&output_format=JSON`, { headers });
      const productData = await productRes.json();
      const products = productData.products;
  
      const detailed = await Promise.all(products.map(async (prod) => {
        try {
          const res = await fetch(`${baseURL}/products/${prod.id}?output_format=JSON`, { headers });
          const detailData = await res.json();
          const product = detailData.product;
  
          const name = product.name[0]?.value || 'Sin nombre';
          const rawDescription = product.description_short?.[0]?.value || '';
          const cleanedDescription = rawDescription.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          const description = cleanedDescription.split('Descripción:')[0].trim();
          const price = product.price || '0.00';
          const color = '#ccc';
          const idImage = product.id_default_image ? parseInt(product.id_default_image) : null;
          const imageUrl = idImage ? getPublicImageUrl(idImage) : null;
          const productType = extractCategoryNames(product, categoryMapRef); // Esto SIEMPRE debe ser un array
  
          // Añadimos el console.log aquí
          console.log(`Producto cargado: ${name} - Categorías: ${productType.join(', ')}`);
          
          return {
            name,
            description,
            price: `${parseFloat(price).toFixed(2)} €`,
            imageUrl,
            colors: [color],
            productType, // Aquí se asegura que sea un array
          };
        } catch {
          return null;
        }
      }));
  
      return detailed.filter(p => p !== null);
    } catch (error) {
      console.error('Error paginando:', error);
      return [];
    }
  };
  

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const map = await fetchCategoryMap();
      setCategoryMap(map);
      categoryMapRef.current = map;

      const productRes = await fetch(`${baseURL}/products?display=[id,name,id_category_default]&output_format=JSON`, { headers });
      const productData = await productRes.json();
      const products = productData.products;

      const detailed = await Promise.all(products.map(async (prod) => {
        try {
          const res = await fetch(`${baseURL}/products/${prod.id}?output_format=JSON`, { headers });
          const detailData = await res.json();
          const product = detailData.product;

          const name = product.name[0]?.value || 'Sin nombre';
          const rawDescription = product.description_short?.[0]?.value || '';
          const cleanedDescription = rawDescription.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          const description = cleanedDescription.split('Descripción:')[0].trim();
          const price = product.price || '0.00';
          const color = '#ccc';
          const idImage = product.id_default_image ? parseInt(product.id_default_image) : null;
          const imageUrl = idImage ? getPublicImageUrl(idImage) : null;
          const productType = extractCategoryNames(product, map);

          // Añadimos el console.log aquí
          console.log(`Producto cargado: ${name} - Categorías: ${productType.join(', ')}`);

          return {
            name,
            description,
            price: `${parseFloat(price).toFixed(2)} €`,
            imageUrl,
            colors: [color],
            productType,
          };
        } catch {
          return null;
        }
      }));

      const cleaned = detailed.filter(p => p !== null);

      setAllProducts(cleaned);
      setVisibleProducts(cleaned.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      currentPageRef.current = 1;
      setLoading(false);
    };

    loadInitialData();
  }, []);
  

  const loadMore = () => {
    if (isLoadingMore) return;
  
    setIsLoadingMore(true);
    const nextPage = currentPageRef.current + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const nextProducts = allProducts.slice(start, end);
  
    if (nextProducts.length > 0) {
      setVisibleProducts(prev => [...prev, ...nextProducts]);
      setPage(nextPage);
      currentPageRef.current = nextPage;
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

  const filterByCategory = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory(null);
      setVisibleProducts(allProducts.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      currentPageRef.current = 1;
    } else {
      const filtered = allProducts.filter((product) => {
        const categories = product.productType || []; // Asegúrate que sea un array
  
        if (Array.isArray(categories)) { // Asegúrate de que esté en formato de array
          return categories.some(cat => cat.toLowerCase() === category.toLowerCase());
        } else {
          console.warn('Producto con formato incorrecto:', product);
          return false;
        }
      });
  
      setSelectedCategory(category);
      setVisibleProducts(filtered.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      currentPageRef.current = 1;
    }
  };  
  

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={styles.container}
      onMomentumScrollEnd={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;

        if (isCloseToBottom && !isLoadingMore) {
          loadMore();
        }
      }}
    >


        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.category}>Catálogo</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="shopping-bag" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
          <View style={styles.filterButtonContent}>
            <AntDesign name="filter" size={15} color="#707B81" />
            <Text style={styles.filterButtonText}>Filtrar</Text>
          </View>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {categories.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => filterByCategory(item.name)}>
              <View style={[styles.categoryItem, selectedCategory === item.name && { opacity: 0.5 }]}>
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.productGrid}>
          {visibleProducts.map((product, index) => (
            <TouchableOpacity key={index} style={styles.productCard} onPress={() => navigation.navigate('details', { producto: product })} >
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <View style={styles.priceColorsRow}>
              <Text style={styles.productPrice}>{product.price}</Text>
              <View style={styles.colorOptions}>
                {product.colors.map((color, i) => (
                  <View key={i} style={[styles.colorDot, { backgroundColor: color }]} />
                ))}
              </View>
            </View>
          </TouchableOpacity>
          
          ))}
        </View>
      </ScrollView>

      {showFilter && (
        <Animated.View style={[styles.slidePanel, { bottom: slideAnim }]}>
          <View style={styles.handleBar} />
          <View style={styles.panelHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={toggleFilter}>
              <Text style={styles.clearText}>BORRAR</Text>
            </TouchableOpacity>
          </View>
          {/* Aquí irían los filtros */}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  category: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 20,
  },
  headerIcon: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 20,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#707B81',
    fontSize: 14,
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontFamily: 'Montserrat_500Medium',
    color: '#C55417',
    fontSize: 14,
    marginBottom: 5,
  },
  productDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 8,
    marginBottom: 5,
  },
  priceColorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  productPrice: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  },
  colorOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginLeft: 5,
  },
  slidePanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    paddingBottom: 40,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_500Medium',
    color: '#1D1D1D',
  },
  clearText: {
    color: '#707B81',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#C55417',
    width: 200,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontFamily: 'Montserrat_500Medium',
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
});