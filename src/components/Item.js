import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "../styles/HomeStyles";

const Item = ({
  elemento,
  presionado,
  onToggleComplete,
  customStyle,
  isDetailView = false,
  onUpdateTask,
}) => {
  const [isStarFilled, setStarFilled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(elemento.titulo);
  const [editedDate, setEditedDate] = useState(new Date(elemento.fecha));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePress = () => {
    if (isDetailView) {
      // En vista de detalles, activa edición con clic simple
      setIsEditing(true);
    } else {
      // En la lista principal, navega a detalles
      presionado();
    }
  };

  const handleSave = () => {
    const updatedTask = {
      ...elemento,
      titulo: editedTitle,
      fecha: editedDate.toISOString(),
    };
    onUpdateTask(updatedTask);
    setIsEditing(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditedDate(selectedDate);
    }
  };

  useEffect(() => {
    setEditedTitle(elemento.titulo);
    setEditedDate(new Date(elemento.fecha));
  }, [elemento]);

  return (
    <TouchableOpacity
      style={[styles.item, customStyle]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        onPress={onToggleComplete}
        style={[styles.circle, elemento.estado === "0" && styles.filledCircle]}
      />

      <View style={styles.textContainer}>
        {isEditing && isDetailView ? (
          <>
            <TextInput
              multiline={true}
              style={[
                styles.title,
                { borderBottomWidth: 1, borderColor: "#007AFF", padding: 8 },
              ]}
              value={editedTitle}
              onChangeText={setEditedTitle}
              autoFocus
              onSubmitEditing={handleSave}
              blurOnSubmit={true}
            />
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{ marginTop: 10 }}
            >
              <Text style={styles.date}>
                {editedDate.toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={editedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#007AFF" }]}
                onPress={handleSave}
              >
                <Text style={{ color: "white" }}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#ccc", marginLeft: 10 },
                ]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={{ color: "black" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text
              style={
                elemento.estado === "1" ? styles.title : styles.textCompleted
              }
            >
              {elemento.titulo}
            </Text>
            <Text style={styles.date}>
              {new Date(elemento.fecha).toLocaleDateString("es-ES", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </>
        )}
      </View>

      {!isEditing && (
        <TouchableOpacity onPress={() => setStarFilled(!isStarFilled)}>
          <Ionicons
            name={isStarFilled ? "star" : "star-outline"}
            size={25}
            color={"gray"}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default Item;
