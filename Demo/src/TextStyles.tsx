import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

export const styles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 6,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

function createText(style: TextStyle) {
  return (props: TextProps) => <Text style={style} {...props} />
}

export const H1 = createText(styles.h1);
export const H2 = createText(styles.h2);
