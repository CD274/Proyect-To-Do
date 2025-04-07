import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F7F7",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
  },
  taskList: {
    marginBottom: 30,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  subtask: {
    marginLeft: 40,
    borderBottomColor: "#f0f0f0",
  },
  checkbox: {
    marginRight: 15,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  taskText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  addStepButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  addStepText: {
    color: "#007AFF",
    fontSize: 16,
  },
  optionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textTransform: "uppercase",
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  addNoteButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 30,
  },
  addNoteText: {
    fontSize: 16,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 15,
  },
  creationDate: {
    fontSize: 14,
    color: "#999",
    marginBottom: 30,
    textAlign: "center",
  },
});
