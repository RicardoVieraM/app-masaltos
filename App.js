import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from './src/CartContext';

import logo from './assets/logo-masaltos.png';
import signup from './src/signup';
import recordarcontraseña from './src/recordar-contraseña';
import signin from './src/signin';
import inicio from './src/inicio';
import details from './src/details';
import perfil from './src/perfil';
import pedidos from './src/pedidos';
import detallespedido from './src/detalles-pedido';
import notifications from './src/notifications';
import Catalogo from './src/catalogo';
import cart from './src/cart';
import settings from './src/settings';
import contactanos from './src/contactanos';
import checkout from './src/checkout';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <Image source={logo} style={styles.image} />
        <Text style={styles.encabezado1}>Elige estilo, elige altura</Text>
        <Text style={styles.encabezado2}>Zapatos con alzas para elevar tu estatura 7 cm.</Text>
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('signin')}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="signup" component={signup} options={{ headerShown: false }} />
          <Stack.Screen name="recordarcontraseña" component={recordarcontraseña} options={{ headerShown: false }} />
          <Stack.Screen name="signin" component={signin} options={{ headerShown: false }} />
          <Stack.Screen name="inicio" component={inicio} options={{ headerShown: false }} />
          <Stack.Screen name="details" component={details} options={{ headerShown: false }} />
          <Stack.Screen name="perfil" component={perfil} options={{ headerShown: false }} />
          <Stack.Screen name="pedidos" component={pedidos} options={{ headerShown: false }} />
          <Stack.Screen name="detallespedido" component={detallespedido} options={{ headerShown: false }} />
          <Stack.Screen name="notifications" component={notifications} options={{ headerShown: false }} />
          <Stack.Screen name="catalogo" component={Catalogo} options={{ headerShown: false }} />
          <Stack.Screen name="cart" component={cart} options={{ headerShown: false }} />
          <Stack.Screen name="settings" component={settings} options={{ headerShown: false }} />
          <Stack.Screen name="contactanos" component={contactanos} options={{ headerShown: false }} />
          <Stack.Screen name="checkout" component={checkout} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 400,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 60,
  },
  encabezado1: {
    fontSize: 38,
    fontFamily: 'Montserrat_500Medium',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  encabezado2: {
    fontSize: 20,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: '#707B81',
    margin: 30,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#C55417',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
