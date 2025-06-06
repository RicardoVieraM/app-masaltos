import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
  
export default function Notifications() {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.category}>Notificaciones</Text>
        </View>
      </View>

      <Text style={styles.status}>No leídas</Text>
      
      <View style={styles.card}>
        <Image source={require('../assets/img1.png')} style={styles.img} />
        <View style={styles.textContainer}>
          <Text style={styles.description}>Tenemos nuevos productos en oferta</Text>
          <Text style={styles.price}>116,10 €  <Text style={styles.oldPrice}>110,00 €</Text></Text>
        </View>
        <Text style={styles.timestamp}>hace 6 min</Text>
      </View>

      <View style={styles.card}>
        <Image source={require('../assets/shoe3.png')} style={styles.img} />
        <View style={styles.textContainer}>
          <Text style={styles.description}>Tenemos nuevos productos en oferta</Text>
          <Text style={styles.price}>120,60 €  <Text style={styles.oldPrice}>134,00 €</Text></Text>
        </View>
        <Text style={styles.timestamp}>hace 36 min</Text>
      </View>

      <Text style={styles.status}>Leídas</Text>

      <View style={styles.card}>
        <Image source={require('../assets/shoe2.png')} style={styles.img} />
        <View style={styles.textContainer}>
          <Text style={styles.description}>¡Nuevo modelo disponible!</Text>
        </View>
        <Text style={styles.timestamp}>hace una semana</Text>
      </View>
    </ScrollView>
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
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
    marginTop: 10,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    position: 'relative',
  },
  img: {
    height: 100,
    width: 100,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  timestamp: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Montserrat_400Regular',
  },
  status: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 18,
    marginTop: 30,
  },
  description: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    marginBottom: 10,
  },
  price: {
    fontFamily: 'Montserrat_400Regular',
  },
  oldPrice: {
    fontFamily: 'Montserrat_400Regular',
    textDecorationLine: 'line-through',
    color: 'red',
  }
});
