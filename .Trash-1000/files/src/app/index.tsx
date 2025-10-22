import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function ModalScreen() {
  return (
  <Redirect href="/(auth)/login" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
