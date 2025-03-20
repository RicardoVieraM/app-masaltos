import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>Introduzca su dirección de correo electrónico para recibir un código de verificación</Text>

      <Text style={styles.label}>Dirección email</Text>
      <TextInput style={styles.input} placeholder="ejemplo@gmail.com" value={email} onChangeText={setEmail} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
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
        fontFamily: 'Montserrat_400Regular',
        textAlign: 'center',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
        color: '#707B81',
        marginBottom: 30,
        textAlign: 'center',
      },
      label: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
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
      button: {
        backgroundColor: '#C55417',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 15,
        width: '100%',
      },
      buttonText: {
        fontFamily: 'Montserrat_400Regular',
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      },
});
