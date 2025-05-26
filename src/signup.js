import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebaseConfig";

import logo from '../assets/logo-google.png';

export default function LoginScreen() {
  const isValidEmail = email => /\S+@\S+\.\S+/.test(email);
  const [emailVerificado, setEmailVerificado] = useState(false);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
  
      await updateProfile(userCredential.user, {
        displayName: nombre.trim()
      });
  
      await sendEmailVerification(auth.currentUser);
  
      alert('¡Cuenta creada! Revisa tu email para verificar tu cuenta.');
      navigation.navigate('inicio', { userName: nombre.trim() });
    } catch (error) {
      let message = 'Ha ocurrido un error inesperado.';
  
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Este correo ya está registrado.';
          break;
        case 'auth/invalid-email':
          message = 'La dirección de correo no es válida.';
          break;
        case 'auth/weak-password':
          message = 'La contraseña es demasiado débil. Usa al menos 6 caracteres.';
          break;
        case 'auth/missing-password':
          message = 'Introduce una contraseña.';
          break;
        default:
          message = 'Error al registrarse: ' + error.message;
          break;
      }
  
      alert(message);
    }
  };  
  

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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>¡Gracias por unirte!</Text>
      
      <Text style={styles.label}>Tu nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu nombre aquí"
        value={nombre}
        onChangeText={setNombre}
      />

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
      
      <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
        <Text style={styles.loginButtonText}>Crear cuenta</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.googleButton}>
        <Image source={logo} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
      
      <Text style={styles.registerText}>
        ¿Ya tienes una cuenta? {" "}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('signin')}>
          Inicia sesión
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
    alignItems: 'center',
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
    color: 'black',
  },
});
