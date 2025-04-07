import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/HomeStyles";

const Cabecera = () => (
  <SafeAreaView style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Mi día</Text>
  </SafeAreaView>
);

export default Cabecera;
