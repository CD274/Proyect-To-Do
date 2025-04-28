import { useState, useEffect, useCallback } from "react";
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { tasks } from "../../db/schema";

// Abrir la base de datos
const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);
export function useTasks() {
  // Función para cargar tareas
  const [tasksData, setTasksData] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db.select().from(tasks).all();
      setTasksData(result);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTask = useCallback(async (id) => {
    try {
      setTaskLoading(true);
      const result = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, id))
        .get();
      setCurrentTask(result);
      return result;
    } catch (error) {
      console.error("Error loading task:", error);
      return null;
    } finally {
      setTaskLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshFlag]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshFlag]);

  // Cargar tareas al inicio y cuando cambia refreshFlag
  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshFlag]);

  // Alternar estado de completado
  const toggleComplete = useCallback(async (id) => {
    try {
      // Primero obtenemos el estado actual
      const task = await db.select().from(tasks).where(eq(tasks.id, id)).get();
      if (task) {
        // Actualizamos el estado en la base de datos
        await db
          .update(tasks)
          .set({ isDaily: !task.isDaily })
          .where(eq(tasks.id, id))
          .run();

        // Refrescamos los datos
        setRefreshFlag((prev) => !prev);

        loadTasks();
      }
    } catch (error) {
      console.log("ID del fallo:", id);
      console.error("Error toggling task completion:", error);
    }
  }, []);

  // Agregar nueva tarea
  const addTask = useCallback(async (newTask) => {
    try {
      await db.insert(tasks).values(newTask).run();
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }, []);

  // Actualizar tarea existente
  const updateTask = useCallback(async (updatedTask) => {
    try {
      await db
        .update(tasks)
        .set(updatedTask)
        .where(eq(tasks.id, updatedTask.id))
        .run();
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }, []);

  // Función para refrescar manualmente
  const refreshTasks = useCallback(() => {
    setRefreshFlag((prev) => !prev);
  }, []);

  return {
    tasks: tasksData,
    loading,
    toggleComplete,
    addTask,
    refreshTasks,
    updateTask,
    setTasks: setTasksData,
    loadTask,
  };
}
