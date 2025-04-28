import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "../../src/styles/detailTask";
import { useTasks } from "../../src/hooks/useTasks";
import Item from "../../src/components/Item";

export default function Details() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { currentTask, taskLoading, toggleComplete, updateTask, loadTask } =
    useTasks();
  const [localTask, setLocalTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      const task = await loadTask(id);
      setLocalTask(task);
    };
    fetchTask();
  }, [id]);

  useEffect(() => {
    if (localTask) {
      navigation.setOptions({
        title: localTask.name || "Detalle",
      });
    }
  }, [localTask, navigation]);

  if (taskLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!localTask) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la tarea</Text>
      </View>
    );
  }

  const handleUpdateTask = (updatedTask) => {
    updateTask(updatedTask);
    setLocalTask(updatedTask);
    navigation.setOptions({
      title: updatedTask.name,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.taskList}>
        <Item
          elemento={localTask}
          presionado={() => {}}
          onToggleComplete={() => toggleComplete(localTask.id)}
          customStyle={styles.taskItem}
          isDetailView={true}
          onUpdateTask={handleUpdateTask}
        />
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
        {new Date(localTask.date).toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Text>
    </ScrollView>
  );
}
