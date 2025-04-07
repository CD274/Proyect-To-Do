import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useTasks } from "../hooks/useTasks";

const Item = ({ elemento, presionado }) => {
  const { toggleComplete, deleteTask, refreshTasks } = useTasks();

  const handleToggleComplete = async () => {
    try {
      await toggleComplete(elemento.id);
      refreshTasks(); // Actualizar lista después de cambiar estado
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado de la tarea");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que quieres eliminar esta tarea?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteTask(elemento.id);
              refreshTasks(); // Actualizar lista después de eliminar
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la tarea");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={presionado} style={styles.item}>
      <View style={styles.itemContent}>
        <Text
          style={[styles.title, elemento.estado === 0 && styles.completedTitle]}
        >
          {elemento.titulo}
        </Text>
        <Text style={styles.date}>
          {new Date(elemento.fecha).toLocaleDateString("es-ES")}
        </Text>
        {elemento.es_recurrente && (
          <Text style={styles.recurrentBadge}>Recurrente</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleToggleComplete}
          style={[
            styles.actionButton,
            elemento.estado === 0 && styles.completedButton,
          ]}
        >
          <Text style={styles.actionText}>
            {elemento.estado === 0 ? "✓" : "○"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={styles.actionText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  recurrentBadge: {
    fontSize: 12,
    color: "#70b2b2",
    marginTop: 5,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  completedButton: {
    backgroundColor: "#70b2b2",
  },
  deleteButton: {
    backgroundColor: "#ffcccc",
  },
  actionText: {
    fontSize: 18,
  },
});

export default Item;
