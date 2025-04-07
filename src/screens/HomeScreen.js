import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  View,
  Pressable,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Cabecera from "../components/Cabecera";
import BtnAgregar from "../components/BtnAgregar";
import Item from "../components/Item";
import { styles } from "../styles/HomeStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "@tareas_app";

const HomeScreen = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datosGuardados = await AsyncStorage.getItem(STORAGE_KEY);
        if (datosGuardados) setData(JSON.parse(datosGuardados));
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar las tareas");
      }
    };
    cargarDatos();
  }, []);

  // Guardar datos cuando cambien
  useEffect(() => {
    const guardarDatos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        Alert.alert("Error", "No se pudieron guardar las tareas");
      }
    };
    guardarDatos();
  }, [data]);

  const agregarTarea = (nuevaTarea) => {
    setData([...data, nuevaTarea]);
  };

  const toggleComplete = (id) => {
    setData(
      data.map((item) =>
        item.id === id
          ? { ...item, estado: item.estado === "1" ? "0" : "1" }
          : item
      )
    );
  };

  const renderItem = ({ item }) => (
    <Link href={`/details/${item.id}`} asChild>
      <Pressable>
        <Item
          elemento={item}
          presionado={() => setSelectedId(item.id)}
          onToggleComplete={() => toggleComplete(item.id)}
        />
      </Pressable>
    </Link>
  );

  const dataFilter = data.filter((item) =>
    showCompleted ? item.estado === "1" : item.estado === "0"
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Cabecera />
        <FlatList
          data={dataFilter}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <Text style={styles.filterButtonText}>
            {showCompleted ? "Pendientes" : "Realizadas"}
          </Text>
        </TouchableOpacity>
        <BtnAgregar onAgregarTarea={agregarTarea} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default HomeScreen;
