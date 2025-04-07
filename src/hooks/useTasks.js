import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@tareas_app";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Función para cargar tareas
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setTasks(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar tareas al inicio y cuando cambia refreshFlag
  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshFlag]);

  // Guardar tareas automáticamente cuando cambian
  useEffect(() => {
    const saveTasks = async () => {
      if (!loading) {
        // Solo guardar si no estamos cargando
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
          console.error("Error saving tasks:", error);
        }
      }
    };

    saveTasks();
  }, [tasks, loading]);

  // Alternar estado de completado
  const toggleComplete = useCallback((id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, estado: task.estado === "1" ? "0" : "1" }
          : task
      )
    );
  }, []);

  // Agregar nueva tarea
  const addTask = useCallback((newTask) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  }, []);

  // Función para refrescar manualmente
  const refreshTasks = useCallback(() => {
    setRefreshFlag((prev) => !prev);
  }, []);
  const updateTask = useCallback((updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  }, []);
  return {
    tasks,
    loading,
    toggleComplete,
    addTask,
    refreshTasks,
    updateTask,
    setTasks: useCallback(setTasks, []),
  };
}
