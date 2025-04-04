import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons, FontAwesome, FontAwesome5, FontAwesome6, Feather } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';

export default function Contactanos() {
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
          <Text style={styles.title}>Contáctanos</Text>
        </View>
      </View>

        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('mailto:info@masaltos.com')} >
          <View style={styles.contactContent}>
            <MaterialCommunityIcons name='email' size={24} color="#fdedac" />
            <Text style={styles.contactText}>info@masaltos.com</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('tel:0034954564292')} >
          <View style={styles.contactContent}>
            <MaterialCommunityIcons name='phone' size={24} color="#c55417" />
            <Text style={styles.contactText}>(0034) 954 564 292</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('https://wa.me/0034638726246')} >
          <View style={styles.contactContent}>
            <MaterialCommunityIcons name='whatsapp' size={24} color="#25d366" />
            <Text style={styles.contactText}>(0034) 638 726 246</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('https://www.instagram.com/masaltos_com')} >
          <View style={styles.contactContent}>
            <MaterialCommunityIcons name='instagram' size={24} color="#e4405f" />
            <Text style={styles.contactText}>@masaltos_com</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('https://www.tiktok.com/@masaltos_com')} >
          <View style={styles.contactContent}>
            <MaterialIcons name='tiktok' size={24} color="black" />
            <Text style={styles.contactText}>masaltos_com</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('https://www.facebook.com/masaltoscom')} >
          <View style={styles.contactContent}>
            <MaterialCommunityIcons name='facebook' size={24} color="#1877f2" />
            <Text style={styles.contactText}>Masaltos.com - Zapatos con Alzas</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('https://twitter.com/Masaltos')} >
          <View style={styles.contactContent}>
            <FontAwesome6 name="x-twitter" size={24} color="black" />
            <Text style={styles.contactText}>@Masaltos</Text>
          </View>
        </TouchableOpacity>
    </ScrollView>
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
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
    marginTop: 10,
  },
  titleContainer: {
    position: 'absolute', // Permite centrar el título sin que se vea afectado por los botones
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerIcon: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
  },
  title: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 20,
  },
  contactButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontFamily: 'Montserrat_500Medium',
    marginLeft: 10,
    fontSize: 16,
  },
});
