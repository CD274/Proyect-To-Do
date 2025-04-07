import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Cabecera from "../../src/components/Cabecera";
import BtnAgregar from "../../src/components/BtnAgregar";
import Item from "../../src/components/Item";
import { styles } from "../../src/styles/HomeStyles";
import { useTasks } from "../../src/hooks/useTasks";

export default function HomeScreen() {
  const [selectedId, setSelectedId] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const { tasks, loading, toggleComplete, addTask, refreshTasks } = useTasks();
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // Actualización segura cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      setNeedsRefresh(true);
    }, [])
  );

  // Efecto separado para manejar el refresh cuando es necesario
  useEffect(() => {
    if (needsRefresh) {
      refreshTasks();
      setNeedsRefresh(false);
    }
  }, [needsRefresh, refreshTasks]);

  const renderItem = ({ item }) => (
    <Item
      elemento={item}
      presionado={() => {
        setSelectedId(item.id);
        router.push(`/details/${item.id}`);
      }}
      onToggleComplete={() => {
        toggleComplete(item.id);
        setNeedsRefresh(true); // Marcar para refrescar después de cambiar estado
      }}
    />
  );

  const filteredTasks = tasks.filter((item) =>
    showCompleted ? item.estado === "1" : item.estado === "0"
  );

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Cabecera />
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={{ selectedId, needsRefresh }} // Actualizar cuando cambia
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <Text style={styles.filterButtonText}>
            {showCompleted ? "Pendientes" : "Realizadas"}
          </Text>
        </TouchableOpacity>
        <BtnAgregar onAgregarTarea={addTask} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
