import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCart } from "./CartContext";

export default function Checkout() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const route = useRoute();
  const { subtotal, impuestos, total } = route.params;
  const { clearCart } = useCart();

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
        clearCart();
        setModalVisible(false);
        navigation.navigate('inicio');
      });
    };

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
          <Text style={styles.title}>Checkout</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información de contacto</Text>

        <View style={styles.row}>
            <View style={styles.icon}>
                <MaterialCommunityIcons name="email-outline" size={24} color="black" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.infoText}>ricardoviera4m@gmail.com</Text>
                <Text style={styles.infoDesc}>Email</Text>
            </View>
            <AntDesign name="edit" size={24} color="gray" style={styles.editIcon} />
        </View>

        <View style={styles.row}>
            <View style={styles.icon}>
                <Feather name="phone" size={24} color="black" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.infoText}>+34 644 87 37 90</Text>
                <Text style={styles.infoDesc}>Teléfono</Text>
            </View>
            <AntDesign name="edit" size={24} color="gray" style={styles.editIcon} />
        </View>


        <Text style={styles.sectionTitle}>Dirección</Text>
        <Text style={styles.addressText}>Calle Aztecas nº 57, Sevilla, 41007</Text>
        <Image source={require('../assets/map.png')} style={styles.map} />
        

        <Text style={styles.sectionTitle}>Método de pago</Text>
        <View style={styles.row}>
          <Image source={require('../assets/logo-paypal.png')} style={styles.paypal} />
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>Paypal Card</Text>
            <Text style={styles.infoDesc}>**** **** 0696 4629</Text>
          </View>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>{subtotal} €</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Transporte</Text>
          <Text style={styles.freeText}>Gratis</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Impuestos incluidos</Text>
          <Text style={styles.summaryText}>{impuestos} €</Text>
        </View>
      
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>{total} €</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={openModal}>
            <Text style={styles.checkoutText}>Pago</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
                <View style={styles.partyContainer}>
                    <Image source={require('../assets/party.png')} style={styles.party} />
                </View>
                <Text style={styles.modalText}>Tu pago se ha realizado correctamente</Text>
                <TouchableOpacity style={styles.modalButton} onPress={closeModal} >
                    <Text style={styles.modalButtonText}>Volver a inicio</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

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
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerIcon: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat_500Medium',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 15,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  infoDesc: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#888',
    marginTop: 2,
  },
  addressText: {
    fontFamily: 'Montserrat_400Regular',
    marginTop: 10,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 80,
    borderRadius: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Montserrat_500Medium',
    marginBottom: 5,
  },
  paypal: {
    width: 30,
    height: 30,
  },
  cardText: {
    fontFamily: 'Montserrat_400Regular',
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#333',
  },
  freeText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#4CAF50',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 18,
  },
  checkoutBtn: {
    backgroundColor: '#C55417',
    borderRadius: 30,
    paddingVertical: 16,
    marginTop: 20,
  },
  checkoutText: {
    color: '#fff',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  partyContainer: {
    backgroundColor: '#dfefff',
    borderRadius: 80,
  },
  party: {
    width: 80,
    height: 80,
    margin: 25,
  },
  modalText: {
    fontSize: 18,
    fontFamily: 'Montserrat_500Medium',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#C55417',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
  },  
});
