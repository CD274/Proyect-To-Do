import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
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
  const { tasks, loading, toggleComplete, updateTask } = useTasks();

  // Encuentra el ítem directamente desde las tasks del hook
  const item = tasks.find((task) => task.id === id);

  useEffect(() => {
    if (item) {
      navigation.setOptions({
        title: item.titulo,
      });
    }
  }, [item, navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>No se encontró el ítem</Text>
      </View>
    );
  }
  const handleUpdateTask = (updatedTask) => {
    updateTask(updatedTask);
    navigation.setOptions({
      title: updatedTask.titulo,
    });
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.taskList}>
        {/* Usamos el componente Item con la función toggleComplete del hook */}
        <Item
          elemento={item}
          presionado={() => {}}
          onToggleComplete={() => toggleComplete(item.id)}
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
        {new Date(item.fecha).toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Text>
    </ScrollView>
  );
}
