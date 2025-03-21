import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const navigation = useNavigation();

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {menuVisible && (
        <Animated.View style={[styles.sideMenu, { left: slideAnim }]}> 
          <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <Image source={require('../assets/shoe1.png')} style={styles.userImage} />
          <Text style={styles.menuGreeting}>Hola,</Text>
          <Text style={styles.menuUser}>Nerea</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <MaterialCommunityIcons name="account-outline" size={24} color="black" />
              <Text style={styles.menuText}>Perfil</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <AntDesign name="home" size={24} color='#C55417' />
              <Text style={styles.menuCurrentText}>Home</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Feather name="calendar" size={24} color="black" />
              <Text style={styles.menuText}>Catálogo</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
            <MaterialCommunityIcons name="truck-fast-outline" size={24} color="black" />
              <Text style={styles.menuText}>Pedidos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="notifications-outline" size={24} color="black" />
              <Text style={styles.menuText}>Notificaciones</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
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
        </Animated.View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Feather style={styles.headerIcon} name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Image source={require('../assets/logo-masaltos.png')} style={styles.logo} />
        <TouchableOpacity>
          <Feather style={styles.headerIcon} name="shopping-bag" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#707B81" />
        <TextInput style={styles.searchInput} placeholder="Búsqueda en el catálogo..." />
      </View>
      
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
            <TouchableOpacity style={styles.top}>
                <MaterialCommunityIcons name="fire" size={24} color="red" style={styles.iconLeft} />
                <Text style={styles.topText}>Top</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.category}><Text style={styles.categoryText}>Botas</Text></TouchableOpacity>
            <TouchableOpacity style={styles.category}><Text style={styles.categoryText}>Novios</Text></TouchableOpacity>
            <TouchableOpacity style={styles.category}><Text style={styles.categoryText}>Sneakers</Text></TouchableOpacity>
            <TouchableOpacity style={styles.category}><Text style={styles.categoryText}>Casual</Text></TouchableOpacity>
        </ScrollView>

        <Text style={styles.sectionTitle}>Zapatos populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularShoes}>
          <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('details')} >
            <Image source={require('../assets/shoe1.png')} style={styles.productImage} />
            <Text style={styles.desc}>BEST SELLER</Text>
            <Text style={styles.productTitle}>Treviso</Text>
            <Text style={styles.productPrice}>143,10 €</Text>
            <TouchableOpacity style={styles.add}><Text style={styles.addText}>+</Text></TouchableOpacity>
          </TouchableOpacity>
            <View style={styles.productCard}>
                <Image source={require('../assets/shoe2.png')} style={styles.productImage} />
                <Text style={styles.desc}>BEST SELLER</Text>
                <Text style={styles.productTitle}>Bergen Negro</Text>
                <Text style={styles.productPrice}>134,10 €</Text>
                <TouchableOpacity style={styles.add}><Text style={styles.addText}>+</Text></TouchableOpacity>
            </View>
        </ScrollView>

        <Text style={styles.sectionTitle}>Nuevos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularShoes}>
          <View style={styles.lastProductCard}>
            <View>
              <Text style={styles.desc}>BEST CHOICE</Text>
              <Text style={styles.productTitle}>Corby A azul</Text>
              <Text style={styles.productPrice}>139,00 €</Text>
            </View>
            <Image source={require('../assets/shoe3.png')} style={styles.lastProductImage} />
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavIcon}><AntDesign name="home" size={24} color='#C55417' /></TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavIcon}><MaterialCommunityIcons name="truck-fast-outline" size={24} color="#707B81" /></TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavCatalogIcon}><Feather name="calendar" size={24} color="white" /></TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavIcon}><Ionicons name="notifications-outline" size={24} color="#707B81" /></TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavIcon} onPress={() => navigation.navigate('perfil')} ><MaterialCommunityIcons name="account-outline" size={24} color="#707B81" /></TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerIcon : {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
  },
  logo: {
    width: 180,
    height: 50,
    marginLeft: 40,
    marginRight: 40,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 400,
    backgroundColor: '#fcecdf',
    padding: 20,
    paddingTop: 50,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#fff',
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
    fontFamily: 'Montserrat_500Medium',
    marginBottom: 10,
  },
  menuUser: {
    fontSize: 25,
    fontFamily: 'Montserrat_500Medium',
    marginBottom: 30,
  },
  menuItem: {
    paddingVertical: 15,
    marginLeft: 10,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    marginLeft: 20,
  },
  menuCurrentText: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    marginLeft: 20,
    color: '#C55417',
  },
  menuSeparator: {
    height: 3,
    backgroundColor: 'black',
    marginVertical: 10,
    marginLeft: 10,
    marginRight: 150,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    paddingLeft: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
  },
  categories: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C55417',
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
    width: 100,
    height: 50,
    justifyContent: 'center',
  },
  topText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  iconLeft: {
    marginRight: 5,
    backgroundColor: '#ffd1b8',
    padding: 2,
    borderRadius: 20,
  },
  category: {
    backgroundColor: '#EAEAEA',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
  categoriesAndPopular: {
    marginBottom: 20,
  },
  popularShoes: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 18,
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    width: 170,
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
    position: 'relative',
  },
  productImage: {
    width: 150,
    height: 100,
    alignSelf: 'center',
  },
  desc: {
    color: '#C55417',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    marginBottom: 10,
  },
  productTitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
    marginBottom: 10,
  },
  productPrice: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#707B81',
  },
  add: {
    backgroundColor: '#C55417',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    width: 35,
    height: 35,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  addText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
  },
  lastProductCard: {
    flexDirection: 'row', // Para alinear elementos en fila
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 150,
    width: 350,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'space-between'
  },
  lastProductImage: {
    width: 200,
    height: 130,
    marginLeft: 10, // Espaciado a la derecha del texto
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 80,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '112%',
  },
  bottomNavIcon: {
    padding: 25,
  },
  bottomNavCatalogIcon: {
    padding: 15,
    margin: 10,
    backgroundColor: '#C55417',
    borderRadius: 30,
  },
}); 