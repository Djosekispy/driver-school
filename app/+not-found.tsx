import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const NotFoundScreen = () => {
  const navigation = useRouter();

  return (
    <View style={styles.container}>
      {/* Ilustração personalizada */}
      <Image
        source={require('@/assets/images/404-illustration.png')} 
        style={styles.illustration}
        resizeMode="contain"
      />
      
      {/* Mensagem principal */}
      <Text style={styles.title}>Oops! Página não encontrada</Text>
      
      {/* Mensagem secundária */}
      <Text style={styles.subtitle}>
        Parece que você tomou uma rota errada. Vamos te ajudar a voltar aos trilhos!
      </Text>
      
      {/* Botão de ação */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.back()}
      >
        <Feather name="arrow-left" size={20} color="white" />
        <Text style={styles.buttonText}>Voltar à página anterior</Text>
      </TouchableOpacity>
      
      {/* Link alternativo */}
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.push('/(home)')}
      >
        <Text style={styles.linkText}>Ou ir para a página inicial</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  illustration: {
    width: 300,
    height: 300,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: COLORS.textLight,
    paddingHorizontal: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  link: {
    padding: 8,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default NotFoundScreen;