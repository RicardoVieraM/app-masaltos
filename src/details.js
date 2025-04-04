import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';

export default function DetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { producto } = route.params;

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.category}>{producto.productType}</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="shopping-bag" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: producto.imageUrl }} style={styles.image} />
      <View style={styles.productCard}>
        <Text style={styles.title}>{producto.name}</Text>

        <Text style={styles.description}>{producto.description}</Text>

        <View style={styles.imageRow}>
          {/* Puedes poner aquí más imágenes si las tienes */}
          <Image source={{ uri: producto.imageUrl }} style={styles.descriptionImg} />
        </View>

        <View style={styles.sizeRow}>
          <Text style={styles.talla}>Talla</Text>
          <View style={styles.sizeOptions}>
            <Text style={styles.tallasCurrent}>EU</Text>
            <Text style={styles.tallas}>US</Text>
            <Text style={styles.tallas}>UK</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[38, 39, 40, 41, 42, 43].map((size, i) => (
            <TouchableOpacity key={i} style={size === 40 ? styles.tallaNumberCurrent : styles.tallaNumber}>
              <Text style={size === 40 ? styles.tallaNumberCurrentText : styles.tallaNumberText}>{size}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceText}>Precio</Text>
            <Text style={styles.price}>{producto.price}</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Añadir al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_500Medium',
    marginBottom: 10,
  },
  price: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#C55417',

  },
  description: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#707B81'
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  descriptionImg: {
    height: 60,
    width: 70,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  talla: {
    fontSize: 20,
    fontFamily: 'Montserrat_500Medium',
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  tallas: {
    fontFamily: 'Montserrat_400Regular',
  },
  tallasCurrent: {
    fontFamily: 'Montserrat_500Medium',
  },
  tallaNumber: {
    marginRight: 10,
    marginTop: 10,
    padding: 13,
    backgroundColor: '#F8F9FA',
    borderRadius: 30,
  },
  tallaNumberCurrent: {
    marginRight: 10,
    marginTop: 10,
    padding: 13,
    backgroundColor: '#C55417',
    borderRadius: 30,
  },
  tallaNumberText: {
    fontFamily: 'Montserrat_400Regular',
  },
  tallaNumberCurrentText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#fff'
  },
  priceText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#707B81',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    backgroundColor: '#C55417',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});