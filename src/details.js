import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';

export default function DetailsScreen() {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.category}>Botas</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="shopping-bag" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Image source={require('../assets/shoe1.png')} style={styles.image} />
      <View style={styles.productCard}>
        <Text style={styles.title}>Treviso</Text>

        <Text style={styles.description}>
          Zapatos con alzas. Exterior de piel flor de primera calidad. Interior forrado en piel de primera calidad.
        </Text>

        <View style={styles.imageRow}>
          <Image source={require('../assets/img1.png')} style={styles.descriptionImg} />
          <Image source={require('../assets/img2.png')} style={styles.descriptionImg} />
          <Image source={require('../assets/img3.png')} style={styles.descriptionImg} />
          <Image source={require('../assets/img4.png')} style={styles.descriptionImg} />
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
          <TouchableOpacity style={styles.tallaNumber}><Text style={styles.tallaNumberText}>38</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tallaNumber}><Text style={styles.tallaNumberText}>39</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tallaNumberCurrent}><Text style={styles.tallaNumberCurrentText}>40</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tallaNumber}><Text style={styles.tallaNumberText}>41</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tallaNumber}><Text style={styles.tallaNumberText}>42</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tallaNumber}><Text style={styles.tallaNumberText}>43</Text></TouchableOpacity>
        </ScrollView>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceText}>Precio</Text>
            <Text style={styles.price}>143,10 €</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  category: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 20,
    marginLeft: 90,
    marginRight: 90,
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