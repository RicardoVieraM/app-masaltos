import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function LoginScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
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
        <Text style={styles.category}> Perfil </Text>
        <TouchableOpacity style={styles.headerIcon}>
          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={require('../assets/shoe1.png')} style={styles.image} />
        <TouchableOpacity style={styles.cameraContainer}>
          <Feather name="camera" size={15} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Nerea Hebles</Text>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nerea Hebles"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Dirección email</Text>
      <TextInput
        style={styles.input}
        placeholder="nerea@gmail.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="••••••••"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <MaterialCommunityIcons name={secureText ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
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
  imageContainer: {
    alignSelf: 'center',
    position: 'relative',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#C55417',
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_500Medium',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Montserrat_500Medium',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 40,
    marginBottom: 15,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingHorizontal: 12,
    marginBottom: 15,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
});
