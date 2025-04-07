import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  taskList: {
    marginBottom: 24,
  },
  taskItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  editContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  editInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#70b2b2",
    marginRight: 8,
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#70b2b2",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  saveButtonText: {
    color: "#fff",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#666",
  },
  addStepButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#70b2b2",
    borderRadius: 8,
    alignItems: "center",
  },
  addStepText: {
    color: "#70b2b2",
    fontWeight: "bold",
  },
  optionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#666",
  },
  optionButton: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
  },
  addNoteButton: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 24,
  },
  addNoteText: {
    color: "#666",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  creationDate: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  deleteButton: {
    marginRight: 16,
  },
  deleteButtonText: {
    color: "red",
    fontSize: 16,
  },
});
