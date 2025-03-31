import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';

export default function Pedidos() {
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
        <Text style={styles.category}>Pedidos</Text>
      </View>

      <Text style={styles.description}>
        Estos son los pedidos que ha realizado desde que creó su cuenta.
      </Text>

      {[{ id: '001383122', date: '23/02/2025', status: 'Entregado', style: styles.estadoEntregado }, 
        { id: '001283125', date: '23/09/2024', status: 'Cancelado', style: styles.estadoCancelado }].map((pedido, index) => (
        <View key={index} style={styles.pedidoCard}>
          <View style={styles.pedidoHeader}>
            <Text style={styles.numeroPedido}>{pedido.id}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('detallespedido')} >
              <Text style={styles.verDetalles}>Ver detalles</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.date}>{pedido.date}</Text>
          <Text style={pedido.style}>{pedido.status}</Text>
        </View>
      ))}
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
    marginRight: 140,
  },
  headerIcon: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numeroPedido: {
    fontSize: 20,
    fontFamily: 'Montserrat_500Medium',
    marginBottom: 10,
  },
  date: {
    fontFamily: 'Montserrat_400Regular',
    color: '#707B81',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 15,
  },
  estadoEntregado: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    padding: 5,
    width: 90,
    color: '#fff',
    backgroundColor: '#74c874',
    borderRadius: 10,
  },
  estadoCancelado: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    padding: 5,
    width: 90,
    color: '#fff',
    backgroundColor: '#707b81',
    borderRadius: 10,
  },
  verDetalles: {
    color: '#707B81',
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
});
