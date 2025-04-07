import React, { useState, useRef, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  TouchableOpacity,
  View,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { useTasks } from "../../src/hooks/useTasks";
const BtnAgregar = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isTitulo, setTitulo] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [esRecurrente, setEsRecurrente] = useState(false);
  const inputRef = useRef(null);

  const { addTask, refreshTasks } = useTasks();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      setIsAdding(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleAddPress = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAgregar = async () => {
    if (isTitulo.trim() === "") return;

    const nuevaTarea = {
      titulo: isTitulo,
      fecha: date,
      estado: 1, // 1 = pendiente
      es_recurrente: esRecurrente,
    };

    try {
      await addTask(nuevaTarea);
      setTitulo("");
      setDate(new Date());
      setEsRecurrente(false);
      Keyboard.dismiss();
      setIsAdding(false);
      refreshTasks(); // Actualizar la lista de tareas
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  return (
    <View style={styles.container}>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          locale="es-ES"
        />
      )}

      {isAdding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Título"
              value={isTitulo}
              onChangeText={setTitulo}
              onSubmitEditing={handleAgregar}
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {date.toLocaleDateString("es-ES")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.recurrenceButton,
                esRecurrente && styles.recurrenceButtonActive,
              ]}
              onPress={() => setEsRecurrente(!esRecurrente)}
            >
              <Text style={styles.recurrenceButtonText}>
                {esRecurrente ? "✓" : "R"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAgregar}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <TouchableOpacity style={styles.circleButton} onPress={handleAddPress}>
          <Text style={styles.plusSign}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 20,
    alignItems: "flex-end",
  },
  inputContainer: {
    width: Dimensions.get("window").width - 40,
    position: "absolute",
    bottom: Platform.select({
      ios: 60,
      android: 0,
    }),
    right: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 2,
    padding: 8,
    fontSize: 16,
    marginHorizontal: 5,
  },
  dateButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#333",
    fontSize: 16,
  },
  recurrenceButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  recurrenceButtonActive: {
    backgroundColor: "#70b2b2",
  },
  recurrenceButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#70b2b2",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  circleButton: {
    backgroundColor: "#70b2b2",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  plusSign: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default BtnAgregar;
