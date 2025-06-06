import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import useGoogleAuth from '../src/GoogleAuth';

import logo from '../assets/logo-google.png';

export default function RegisterScreen() {
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const nombre = user.displayName || 'Usuario';
      navigation.navigate('inicio', { userName: nombre });
    } catch (error) {
      let message = 'Ha ocurrido un error inesperado.';
  
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'La dirección de correo no es válida.';
          break;
        case 'auth/user-not-found':
          message = 'No existe ninguna cuenta con ese correo.';
          break;
        case 'auth/invalid-credential':
          message = 'La contraseña es incorrecta.';
          break;
        case 'auth/too-many-requests':
          message = 'Demasiados intentos fallidos. Intenta más tarde.';
          break;
        default:
          message = 'Error al iniciar sesión: ' + error.message;
          break;
      }
  
      alert(message);
    }
  };   

  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const navigation = useNavigation();
    let [fontsLoaded] = useFonts({
      Montserrat_400Regular,
      Montserrat_500Medium
    });

    const { request, promptAsync } = useGoogleAuth(navigation);
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.title}>¡Hola de nuevo!</Text>
        <Text style={styles.subtitle}>Te hemos echado de menos</Text>
        
        <Text style={styles.label}>Dirección email</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@gmail.com"
          value={email}
          onChangeText={setEmail}
        />
        
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder=""
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <MaterialCommunityIcons name={secureText ? "eye-off" : "eye"} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('recordarcontraseña')}>
          <Text style={styles.forgotPassword}>Recordar contraseña</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} >
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.googleButton} disabled={!request} onPress={() => promptAsync()}>
          <Image source={logo} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>
        
        <Text style={styles.registerText}>
          ¿No tienes cuenta? {" "}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('signup')}>
            Regístrate gratis
          </Text>
        </Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Montserrat_500Medium',
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Montserrat_400Regular',
      color: '#707B81',
      marginBottom: 50,
      textAlign: 'center',
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
    forgotPassword: {
      fontFamily: 'Montserrat_400Regular',
      color: '#707B81',
      textAlign: 'right',
      marginBottom: 20,
      alignSelf: 'flex-end',
    },
    loginButton: {
      backgroundColor: '#C55417',
      padding: 15,
      borderRadius: 30,
      alignItems: 'center',
      marginBottom: 15,
      width: '100%',
    },
    loginButtonText: {
      fontFamily: 'Montserrat_400Regular',
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    googleButton: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      width: '100%',
    },
    googleIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    googleButtonText: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 16,
      fontWeight: '600',
    },
    registerText: {
      fontFamily: 'Montserrat_400Regular',
      textAlign: 'center',
      color: '#707B81',
    },
    registerLink: {
      fontFamily: 'Montserrat_500Medium',
      color: 'black'
    },
  });
  