import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import xml2js from 'react-native-xml2js';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';

const categories = [
  { name: 'Botas', image: require('../assets/botas.png') },
  { name: 'Novios', image: require('../assets/novios.png') },
  { name: 'Sneakers', image: require('../assets/sneakers.png') },
  { name: 'Casual', image: require('../assets/casual.png') },
  { name: 'Vestir', image: require('../assets/vestir.png') },
  { name: 'Mocasines', image: require('../assets/mocasines.png') },
  { name: 'Goodyear', image: require('../assets/goodyear.png') },
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
  
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://www.masaltos.com/kuantokustad4f731fa87ab46135257d42c74b1f5ee.es.shop1.xml');
        const xml = await response.text();
  
        const parser = new xml2js.Parser({ explicitArray: true });
        parser.parseString(xml, (err, result) => {
          if (err) throw err;
  
          const items = result?.rss?.channel?.[0]?.item || [];
  
          const colorMap = {
            blanco: 'white',
            negro: 'black',
            marrón: 'brown',
            azul: 'blue',
            rojo: 'red',
            gris: 'gray',
            verde: 'green',
            beige: '#f5f5dc',
            camel: '#c19a6b',
            burdeos: '#800020',
            borgoña: '#800020',
          };
  
          const allParsed = items.map((item) => {
            const rawName = item.model?.[0] || item.title?.[0] || '';
            const nameWords = rawName.trim().split(' ');
            const name = nameWords.slice(0, -2).join(' ');
            const productType = item['g:product_type']?.[0]?.trim().toLowerCase() || '';

            const descriptionFull = item.description?.[0] || '';
            const description = descriptionFull.split('Descripción:')[0].trim();
            const price = item['g:price']?.[0] || '0,00 EUR';
            const imageUrl = item['g:image_link']?.[0] || '';
            const colorRaw = item['g:color']?.[0] || '';
            const colorMap = {
              blanco: 'white',
              negro: 'black',
              marrón: 'brown',
              azul: 'blue',
              rojo: 'red',
              gris: 'gray',
              verde: 'green',
              beige: '#f5f5dc',
              camel: '#c19a6b',
              burdeos: '#800020',
              borgoña: '#800020',
            };
            const color = colorMap[colorRaw.trim().toLowerCase()] || '#ccc';

            return {
              name,
              description,
              price,
              imageUrl,
              colors: [color],
              productType,
            };
          });

          const seen = new Set();
          const parsed = allParsed.filter((item) => {
            if (seen.has(item.name)) return false;
            seen.add(item.name);
            return true;
          });

  
          console.log("PRODUCTOS CARGADOS:", parsed);
          setAllProducts(parsed);
          setVisibleProducts(parsed.slice(0, ITEMS_PER_PAGE));
          setPage(1);
        });
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);  
  
  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
  
    const newItems = allProducts.slice(start, end);
    if (newItems.length > 0) {
      setVisibleProducts((prev) => [...prev, ...newItems]);
      setPage(nextPage);
    }
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
    } else {
      const filtered = allProducts.filter(
        (product) => product.productType.toLowerCase().includes(category.toLowerCase())
      );
      setSelectedCategory(category);
      setVisibleProducts(filtered.slice(0, ITEMS_PER_PAGE));
      setPage(1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
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
                <Text style={styles.categoryText}>{item.name}</Text>
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

      {visibleProducts.length < allProducts.length && (
        <View style={{ alignItems: 'center', marginVertical: 8 }}>
          <TouchableOpacity onPress={loadMore} style={styles.button}>
            <Text style={styles.buttonText}>Cargar más</Text>
          </TouchableOpacity>
        </View>
      )}


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
    marginHorizontal: 15,
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