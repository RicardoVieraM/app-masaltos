import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import {
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  EmailAuthProvider,
  signOut,
  reauthenticateWithCredential,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_STORAGE_KEY = "@profile_image_url";

export default function PerfilScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation();
  const [uploading, setUploading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  useEffect(() => {
    const loadImageFromStorage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedImage) {
          setImageUri(storedImage);
        }
        setIsLoaded(true);
      } catch (error) {
        console.log(
          "Error al cargar la imagen del almacenamiento local: ",
          error
        );
      }
    };

    loadImageFromStorage();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setNombre(user.displayName || "");
        setEmail(user.email || "");
        setEmailVerificado(user.emailVerified);
      }
    });

    return () => unsubscribe(); // Limpieza
  }, []);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Se necesita permiso para acceder a las fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      try {
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, uri);
        Alert.alert("¡Imagen guardada localmente con éxito!");
      } catch (error) {
        console.log("Error al guardar la imagen: ", error);
      }
    }
  };

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    try {
      if (!user) return;

      if (!currentPassword.trim()) {
        alert("Introduce tu contraseña actual para poder guardar los cambios.");
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updateProfile(user, { displayName: nombre.trim() });

      if (password.trim().length >= 6) {
        await updatePassword(user, password.trim());
        alert("Contraseña actualizada correctamente.");
      }

      alert("Perfil actualizado correctamente.");
    } catch (error) {
      alert("Error al actualizar el perfil: " + error.message);
    }
    await user.reload();
    setNombre(auth.currentUser.displayName);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("signin");
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.navigate("inicio", { userName: nombre })}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.category}> Perfil </Text>
        <TouchableOpacity style={styles.headerIcon}>
          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {uploading ? (
          <ActivityIndicator size="large" color="#C55417" />
        ) : (
          isLoaded && ( 
            <Image
              source={
                imageUri ? { uri: imageUri } : require("../assets/pfp.png")
              }
              style={styles.image}
            />
          )
        )}
        <TouchableOpacity
          style={styles.cameraContainer}
          onPress={handlePickImage}
        >
          <Feather name="camera" size={15} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{nombre || "Tu perfil"}</Text>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput style={styles.input} value={email} editable={false} />

      <Text style={styles.label}>Contraseña actual</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Introduzca su contraseña"
          secureTextEntry={true}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <MaterialCommunityIcons
            name={secureText ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Nueva contraseña</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Nueva contraseña"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <MaterialCommunityIcons
            name={secureText ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  category: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
  },
  headerIcon: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 25,
  },
  imageContainer: {
    alignSelf: "center",
    position: "relative",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  cameraContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#C55417",
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginTop: 15,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    fontFamily: "Montserrat_400Regular",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 40,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 40,
    paddingHorizontal: 12,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: "#C55417",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 50,
  },
  saveButtonText: {
    fontFamily: "Montserrat_500Medium",
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    fontFamily: "Montserrat_500Medium",
    color: "#fff",
    fontSize: 16,
  },
});
