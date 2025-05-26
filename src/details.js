import React, { useEffect, useState } from "react";
import { Image as RNImage } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

export default function DetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { producto } = route.params;

  const [detalle, setDetalle] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  const mapaTallas = {
    32: "37",
    34: "38",
    35: "39",
    36: "40",
    37: "41",
    38: "42",
    39: "43",
    40: "44",
    41: "45",
    42: "46",
    43: "47",
    48: "S",
    49: "M",
    50: "L",
  };

  const tallasRaw = detalle?.associations?.product_option_values || [];
  const tallas = tallasRaw
    .filter((t) => mapaTallas[t.id]) // solo IDs válidos
    .map((t) => ({
      id: t.id,
      valor: mapaTallas[t.id],
    }))
    .sort((a, b) => {
      const esNumero = (v) => !isNaN(parseInt(v));
      const aVal = a.valor;
      const bVal = b.valor;

      if (esNumero(aVal) && esNumero(bVal)) {
        return parseInt(aVal) - parseInt(bVal);
      } else if (!esNumero(aVal) && !esNumero(bVal)) {
        return aVal.localeCompare(bVal); // ordenar S, M, L
      } else {
        return esNumero(aVal) ? -1 : 1; // números primero
      }
    });

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        let rawId = producto.id;
        const id =
          typeof rawId === "number"
            ? rawId
            : parseInt(String(rawId).trim(), 10);

        if (!id || isNaN(id)) {
          console.warn("❌ ID del producto inválido:", rawId);
          return;
        }

        const url = `https://pruebas.masaltos.com/api/products?filter[id]=${id}&display=full&output_format=JSON`;

        const response = await fetch(url, {
          headers: {
            Authorization: "Basic " + btoa("YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416:"),
          },
        });

        const data = await response.json();

        // Loguear descripciones cortas por idioma de forma limpia
        const langs = data.products?.[0]?.description_short?.language;

        if (Array.isArray(data.products) && data.products.length > 0) {
          const productoDetallado = data.products[0];
          setDetalle(productoDetallado);
        } else {
          console.warn("❌ La API no devolvió ningún producto");
        }
      } catch (err) {
        console.error("❌ Error cargando detalles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, []);

  const obtenerNombreCategoria = (tipos) => {
    if (!Array.isArray(tipos)) return "Sin categoría";

    const mapa = {
      botas: "Botas",
      "zapatos para novio": "Novios",
      "sneakers corner": "Sneakers",
      "zapatos casual": "Casual",
      "zapatos de vestir": "Vestir",
      mocasines: "Mocasines",
      "zapatos goodyear": "Goodyear",
    };

    for (let tipo of tipos) {
      const clave = tipo.trim().toLowerCase();
      if (mapa[clave]) return mapa[clave];
    }

    return tipos[0] || "Sin categoría";
  };

  const getNombreProducto = (nameArray) => {
    if (!Array.isArray(nameArray)) return 'Sin nombre';
    const idioma1 = nameArray.find(n => n.id === "1" || n.id === 1);
    return idioma1?.value || nameArray[0]?.value || 'Sin nombre';
  };


  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  let imagenes = [];

  if (
    detalle?.associations?.images &&
    Array.isArray(detalle.associations.images)
  ) {
    imagenes = detalle.associations.images.map((img) => {
      const imageId = img.id.toString();
      const path = imageId.split("").join("/");
      return `https://pruebas.masaltos.com/img/p/${path}/${imageId}.jpg`;
    });
  } else {
    console.log("🚫 No hay imágenes en detalle.associations.images");
  }

  let descripcionCorta = "Sin descripción";

  const descripcionShort = detalle?.description_short;

  // Si viene como array (más común)
  if (Array.isArray(descripcionShort)) {
    const idioma1 = descripcionShort.find((d) => d.id === "1" || d.id == 1);
    if (idioma1?.value) {
      descripcionCorta = idioma1.value.replace(/<[^>]+>/g, "");
    }
  }

  // Si viene como objeto tipo { language: [...] }
  else if (descripcionShort?.language) {
    const lang = descripcionShort.language;

    if (Array.isArray(lang)) {
      const idioma1 = lang.find((l) => l.id === "1" || l.id == 1);
      if (idioma1?.value) {
        descripcionCorta = idioma1.value.replace(/<[^>]+>/g, "");
      }
    } else if (typeof lang === "object") {
      const value = lang["1"]?.value || Object.values(lang)?.[0]?.value;
      if (value) {
        descripcionCorta = value.replace(/<[^>]+>/g, "");
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.category}>
          {obtenerNombreCategoria(producto.productType)}
        </Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="shopping-bag" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Image
  source={{
    uri: imagenSeleccionada ||
      `https://pruebas.masaltos.com/api/images/products/${producto.id}/${producto.id_default_image}?ws_key=YYCYCN9NITMGC4LP6SE7ZAG3K9Y2Z416`
  }}
  style={[styles.image]}
/>


      <View style={styles.productCard}>
        <Text style={styles.title}>{getNombreProducto(producto.name)}</Text>
        <Text style={styles.description}>{descripcionCorta}</Text>

        {/* Galería de imágenes */}
        {imagenes.length > 0 ? (
          <View style={styles.imageRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {imagenes.map((uri, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setImagenSeleccionada(uri)}
                >
                  <Image
                    source={{ uri }}
                    style={
                      imagenSeleccionada === uri
                        ? styles.descriptionImgSelected
                        : styles.descriptionImg
                    }
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 10, color: "gray" }}>
            No hay imágenes disponibles
          </Text>
        )}

        {/* Tallas */}
        <View style={styles.sizeRow}>
          <Text style={styles.talla}>Talla</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tallas.map((t, i) => {
            const seleccionada = tallaSeleccionada === t.id;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setTallaSeleccionada(t.id)}
              >
                <View
                  style={
                    seleccionada
                      ? styles.tallaNumberCurrent
                      : styles.tallaNumber
                  }
                >
                  <Text
                    style={
                      seleccionada
                        ? styles.tallaNumberCurrentText
                        : styles.tallaNumberText
                    }
                  >
                    {t.valor}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceText}>Precio</Text>
            <Text style={styles.price}>{producto.price}</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Añadir al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  image: {
    width: 300,
    height: 250,
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 20,
  },
  productCard: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 15,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 10,
  },
  price: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#C55417",
  },
  description: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: "#707B81",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  descriptionImg: {
    height: 50,
    marginRight: 10,
    width: 60,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  descriptionImgSelected: {
    height: 50,
    width: 60,
    borderWidth: 2,
    borderColor: "#C55417",
    borderRadius: 5,
    marginRight: 10,
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  talla: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
  },
  sizeOptions: {
    flexDirection: "row",
    gap: 10,
  },
  tallas: {
    fontFamily: "Montserrat_400Regular",
  },
  tallasCurrent: {
    fontFamily: "Montserrat_500Medium",
  },
  tallaNumber: {
    marginRight: 10,
    marginTop: 10,
    padding: 13,
    backgroundColor: "#F8F9FA",
    borderRadius: 30,
  },
  tallaNumberCurrent: {
    marginRight: 10,
    marginTop: 10,
    padding: 13,
    backgroundColor: "#C55417",
    borderRadius: 30,
  },
  tallaNumberText: {
    fontFamily: "Montserrat_400Regular",
  },
  tallaNumberCurrentText: {
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
  },
  priceText: {
    fontFamily: "Montserrat_400Regular",
    color: "#707B81",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#C55417",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
