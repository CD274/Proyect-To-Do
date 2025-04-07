import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { styles } from "../../src/styles/detailTask";
import { useTasks } from "../../src/hooks/useTasks";
import Item from "../../src/components/Item";

export default function Details() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { getTaskById, loading, toggleComplete, updateTask, deleteTask } =
    useTasks();
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  // Cargar la tarea específica
  useEffect(() => {
    const loadTask = async () => {
      try {
        const task = await getTaskById(id);
        setItem(task);
        setEditedTitle(task?.titulo || "");
      } catch (error) {
        console.error("Error loading task:", error);
      }
    };

    loadTask();
  }, [id, getTaskById]);

  useEffect(() => {
    if (item) {
      navigation.setOptions({
        title: item.titulo,
        headerRight: () => (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [item, navigation]);

  const handleToggleComplete = async () => {
    try {
      await toggleComplete(id);
      const updatedTask = await getTaskById(id);
      setItem(updatedTask);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado de la tarea");
    }
  };

  const handleUpdateTask = async () => {
    try {
      const updatedTask = await updateTask(id, {
        titulo: editedTitle,
        fecha: item.fecha,
        es_recurrente: item.es_recurrente,
      });
      setItem(updatedTask);
      setIsEditing(false);
      navigation.setOptions({
        title: updatedTask.titulo,
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la tarea");
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
              await deleteTask(id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la tarea");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading && !item) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la tarea</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.taskList}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              autoFocus
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateTask}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Item
            elemento={item}
            presionado={() => setIsEditing(true)}
            onToggleComplete={handleToggleComplete}
            customStyle={styles.taskItem}
            isDetailView={true}
          />
        )}

        <TouchableOpacity style={styles.addStepButton}>
          <Text style={styles.addStepText}>+ Agregar paso</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsSection}>
        <Text style={styles.sectionTitle}>Agregada a Mi día</Text>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>A Recordarme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>B Vence el Hoy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>C Diariamente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>D Agregar archivo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addNoteButton}>
        <Text style={styles.addNoteText}>Agregar nota</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.creationDate}>
        Creada el{" "}
        {new Date(item.fecha).toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
        {item.es_recurrente && " • Recurrente"}
      </Text>
    </ScrollView>
  );
}
