import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
  
  export default function DetallesPedido() {
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
              <Text style={styles.category}>Detalles del pedido</Text>
            </View>
          </View>
        
        <View style={styles.card}>
          <Text style={styles.description}>Referencia de pedido 001383122 - efectuado el 23/10/2024</Text>
          
          <Text style={styles.boldText}>Transportista:<Text style={styles.text}> MRW - Entrega Estándar</Text></Text>
          <Text style={styles.boldText}>Método de pago:<Text style={styles.text}> Pagos por transferencia bancaria</Text></Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estado de su pedido</Text>
      
          <View style={styles.row}>
            <Text style={styles.date}>23/05/2025</Text>
            <Text style={[styles.status, styles.statusGreen]}>Entregado</Text>
          </View>
      
          <View style={styles.row}>
            <Text style={styles.date}>23/03/2025</Text>
            <Text style={[styles.status, styles.statusBlue]}>Enviado</Text>
          </View>
      
          <View style={styles.row}>
            <Text style={styles.date}>23/02/2025</Text>
            <Text style={[styles.status, styles.statusPurple]}>En espera transferencia bancaria</Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dirección de entrega</Text>
          <Text style={styles.text}>Nerea Hebles</Text>
          <Text style={styles.text}>Calle Feria Sevilla</Text>
          <Text style={styles.text}>España - Península y Baleares</Text>
          <Text style={styles.text}>Sevilla</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Producto</Text>
          <View style={styles.productRow}>
            <Image source={require('../assets/shoe1.png')} style={styles.productImage} />
            <View>
              <Text style={styles.text}>Parma (Talla: 40 - Color: Blanco)</Text>
              <Text style={styles.text}>Referencia: 8435591120554</Text>
              <Text style={styles.price}>134,00€</Text>
            </View>
          </View>
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
      backgroundColor: '#fff',
      padding: 20,
      marginHorizontal: 15,
      marginTop: 10,
      borderRadius: 10,
    },
    description: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 14,
      marginBottom: 10,
    },
    boldText: {
      fontFamily: 'Montserrat_500Medium',
      fontSize: 13,
    },
    text: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 13,
      color: '#707B81',
    },
    sectionTitle: {
      fontFamily: 'Montserrat_500Medium',
      fontSize: 16,
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    date: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 12,
      color: '#333',
    },
    status: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      color: '#fff',
      textAlign: 'center',
    },
    statusGreen: {
      backgroundColor: '#74c874',
    },
    statusBlue: {
      backgroundColor: '#5DADE2',
    },
    statusPurple: {
      backgroundColor: '#7D3C98',
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    productImage: {
      width: 70,
      height: 70,
      marginRight: 15,
    },
    price: {
      fontFamily: 'Montserrat_500Medium',
      fontSize: 16,
      color: '#000',
      marginTop: 5,
    },
  });
  