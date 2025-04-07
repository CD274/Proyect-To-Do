import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_BASE_URL = "http://192.168.1.108:3000/api/tasks"; // Cambia por tu URL de producción
const CACHE_KEY = "@tasks_cache";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Función para manejar errores
  const handleError = (error, customMessage) => {
    console.error(customMessage, error);
    setError(customMessage);
    Alert.alert("Error", customMessage);
    return null;
  };

  // Cargar tareas desde el servidor con cache local
  const loadTasks = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Intentar obtener del cache primero
      if (useCache) {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedData) {
          setTasks(JSON.parse(cachedData));
        }
      }

      // Obtener datos del servidor
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const serverTasks = await response.json();
      setTasks(serverTasks);

      // Actualizar cache
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(serverTasks));
    } catch (error) {
      handleError(error, "Error al cargar las tareas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Crear nueva tarea
  const addTask = useCallback(async (newTask) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdTask = await response.json();

      // Actualizar estado local y cache
      setTasks((prev) => [...prev, createdTask]);
      await AsyncStorage.mergeItem(CACHE_KEY, JSON.stringify([createdTask]));

      setError(null);
      return createdTask;
    } catch (error) {
      return handleError(error, "Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una tarea específica con cache
  const getTaskById = useCallback(async (taskId, useCache = true) => {
    try {
      setLoading(true);

      // Intentar obtener del cache primero
      if (useCache) {
        const cachedTask = await AsyncStorage.getItem(`@task_${taskId}`);
        if (cachedTask) {
          return JSON.parse(cachedTask);
        }
      }

      // Obtener del servidor
      const response = await fetch(`${API_BASE_URL}/${taskId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const taskData = await response.json();

      // Guardar en cache
      await AsyncStorage.setItem(`@task_${taskId}`, JSON.stringify(taskData));

      setError(null);
      return taskData;
    } catch (error) {
      return handleError(error, "Error al obtener la tarea");
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar tarea
  const updateTask = useCallback(async (taskId, updatedData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();

      // Actualizar estado local
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );

      // Actualizar cache
      const cachedTasks = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedTasks) {
        const parsedTasks = JSON.parse(cachedTasks);
        const updatedCache = parsedTasks.map((task) =>
          task.id === taskId ? updatedTask : task
        );
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      }

      // Actualizar cache individual
      await AsyncStorage.setItem(
        `@task_${taskId}`,
        JSON.stringify(updatedTask)
      );

      setError(null);
      return updatedTask;
    } catch (error) {
      return handleError(error, "Error al actualizar la tarea");
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar tarea como completada/incompleta
  const toggleComplete = useCallback(async (taskId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${taskId}/complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();

      // Actualizar estado local
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );

      // Actualizar cache
      const cachedTasks = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedTasks) {
        const parsedTasks = JSON.parse(cachedTasks);
        const updatedCache = parsedTasks.map((task) =>
          task.id === taskId ? updatedTask : task
        );
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      }

      setError(null);
      return updatedTask;
    } catch (error) {
      return handleError(error, "Error al cambiar estado de la tarea");
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar tarea
  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Actualizar estado local
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      // Actualizar cache
      const cachedTasks = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedTasks) {
        const parsedTasks = JSON.parse(cachedTasks);
        const updatedCache = parsedTasks.filter((task) => task.id !== taskId);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      }

      // Eliminar cache individual
      await AsyncStorage.removeItem(`@task_${taskId}`);

      setError(null);
      return true;
    } catch (error) {
      return handleError(error, "Error al eliminar la tarea");
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar manualmente (ignorando cache)
  const refreshTasks = useCallback(async () => {
    setRefreshing(true);
    await loadTasks(false); // false para ignorar cache
  }, [loadTasks]);

  // Filtrar tareas por estado
  const getTasksByStatus = useCallback(
    (status) => {
      return tasks.filter((task) => task.estado === status);
    },
    [tasks]
  );

  return {
    tasks,
    loading,
    error,
    refreshing,
    addTask,
    getTaskById,
    updateTask,
    toggleComplete,
    deleteTask,
    refreshTasks,
    getTasksByStatus,
  };
}
