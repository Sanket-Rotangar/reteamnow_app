// src/screens/RegisterScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../../context/authContext';


const RegisterScreen = ({ navigation }) => {
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // importing register function from AuthContext
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    
    if (password !== confirmPassword) {
      console.warn('Passwords do not match!');
      return;
    }

    try {
      await register(fname, lname, username, email, password);
      console.log('Registration successful');
      navigation.navigate('Login');
    } catch (err: any) {
      console.warn(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="fname"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setfname}
        value={fname}
      />
      <TextInput
        style={styles.input}
        placeholder="lname"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setlname}
        value={lname}
      />
      <TextInput
        style={styles.input}
        placeholder="username"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setusername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />

      <Button title="Register" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'grey',
  },
  switchText: { color: 'blue', marginTop: 15, textAlign: 'center' },
});
