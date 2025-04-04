import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Settings() {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium
  });

  const [faceId, setFaceId] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [location, setLocation] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setDarkMode(JSON.parse(savedDarkMode));
        }
      } catch (error) {
        console.error('Error loading dark mode:', error);
      }
    };
    loadSettings();
  }, []);

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Configuración</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Cuenta</Text>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="notifications-outline" size={24} color="#707B81" />
          <Text style={styles.optionText}>Configuración notificaciones</Text>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#707B81" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons name="truck-fast-outline" size={24} color="#707B81" />
          <Text style={styles.optionText}>Dirección entrega</Text>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#707B81" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <AntDesign name="creditcard" size={24} color="#707B81" />
          <Text style={styles.optionText}>Información de pago</Text>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#707B81" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Octicons name="trash" size={24} color="#707B81" />
          <Text style={styles.optionText}>Borrar cuenta</Text>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#707B81" style={styles.arrowIcon} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Configuración app</Text>

        <View style={styles.switchOption}>
            <Text style={styles.switchOptionText}>Activar FaceID para iniciar sesión</Text>
            <View style={[
                styles.background, 
                { backgroundColor: faceId ? '#C55417' : '#BDBDBD' }
            ]}>
            <Switch
                trackColor={{ false: 'transparent', true: 'transparent' }}
                thumbColor="#FFF"
                ios_backgroundColor="transparent"
                onValueChange={() => setFaceId(!faceId)}
                value={faceId}
                style={styles.switch}
            />
            </View>
        </View>

        <View style={styles.switchOption}>
            <Text style={styles.switchOptionText}>Activar notificaciones Push</Text>
            <View style={[
                styles.background, 
                { backgroundColor: pushNotifications ? '#C55417' : '#BDBDBD' }
            ]}>
            <Switch
                trackColor={{ false: 'transparent', true: 'transparent' }}
                thumbColor="#FFF"
                ios_backgroundColor="transparent"
                onValueChange={() => setPushNotifications(!pushNotifications)}
                value={pushNotifications}
                style={styles.switch}
            />
            </View>
        </View>

        <View style={styles.switchOption}>
            <Text style={styles.switchOptionText}>Activar ubicación</Text>
            <View style={[
                styles.background, 
                { backgroundColor: location ? '#C55417' : '#BDBDBD' }
            ]}>
            <Switch
                trackColor={{ false: 'transparent', true: 'transparent' }}
                thumbColor="#FFF"
                ios_backgroundColor="transparent"
                onValueChange={() => setLocation(!location)}
                value={location}
                style={styles.switch}
            />
            </View>
        </View>

        <View style={styles.switchOption}>
            <Text style={styles.switchOptionText}>Modo oscuro</Text>
            <View style={[
                styles.background, 
                { backgroundColor: darkMode ? '#C55417' : '#BDBDBD' }
            ]}>
            <Switch
                trackColor={{ false: 'transparent', true: 'transparent' }}
                thumbColor="#FFF"
                ios_backgroundColor="transparent"
                onValueChange={toggleDarkMode}
                value={darkMode}
                style={styles.switch}
            />
            </View>
        </View>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="language-outline" size={24} color="#707B81" />
          <Text style={styles.optionText}>Seleccionar idioma</Text>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#707B81" style={styles.arrowIcon} />
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
  },
  title: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 20,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
    marginTop: 25,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  optionText: {
    fontFamily: 'Montserrat_400Regular',
    marginLeft: 15,
    fontSize: 15,
  },
  switchOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  switchOptionText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    marginVertical: 13,
  },
  background: {
    width: 45, // Ajustado para ser más pequeño
    height: 25, // Ajustado para ser más pequeño
    borderRadius: 15, // Borde redondeado más pequeño
    padding: 5, // Margen alrededor del botón reducido
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], // Reducido para que el switch sea más pequeño
    position: 'absolute',
    alignSelf: 'center',
  },
  arrowIcon: {
    marginLeft: 'auto', // Mueve el icono a la derecha
    marginRight: 10,
  },  
});
