import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  const {
    tasks,
    loading,
    error,
    toggleComplete,
    deleteTask,
    refreshTasks,
    getTasksByStatus,
  } = useTasks();

  // Filtrar tareas según el estado
  const filteredTasks = showCompleted
    ? getTasksByStatus(0) // Tareas completadas
    : getTasksByStatus(1); // Tareas pendientes

  // Manejar el refresh manual
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  }, [refreshTasks]);

  // Actualizar al recibir foco
  useFocusEffect(
    useCallback(() => {
      refreshTasks();
    }, [refreshTasks])
  );

  const renderItem = ({ item }) => (
    <Item
      elemento={item}
      presionado={() => {
        setSelectedId(item.id);
        router.push(`/details/${item.id}`);
      }}
      onToggleComplete={async () => {
        await toggleComplete(item.id);
      }}
      onDelete={async () => {
        await deleteTask(item.id);
      }}
    />
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
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
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {showCompleted
                  ? "No hay tareas completadas"
                  : "No hay tareas pendientes"}
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <Text style={styles.filterButtonText}>
            {showCompleted ? "Mostrar Pendientes" : "Mostrar Completadas"}
          </Text>
        </TouchableOpacity>

        <BtnAgregar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
