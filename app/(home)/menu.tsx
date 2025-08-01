import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/firebase';
import { User } from 'lucide-react-native';


const MenuScreen = () => {
  const navigation = useRouter();
  const { user } = useAuth()
const mainOptions = [
  ...(user?.role === 'admin'
    ? [{
        title: "Painel de Gestao",
        icon: <MaterialIcons name="directions-car" size={24} color={COLORS.primary} />,
        action: () => navigation.push('/(admin)')
      }]
    : []),
  {
    title: "Video Aulas",
    icon: <MaterialIcons name="camera" size={24} color={COLORS.primary} />,
    action: () => navigation.navigate('/(videos)/VideoList')
  },
  {
    title: "Dicas de Trânsito",
    icon: <FontAwesome name="lightbulb-o" size={24} color={COLORS.primary} />,
    action: () => navigation.push('/(more)/tip')
  }
];


  // Opções secundárias
  const secondaryOptions = [
    {
      title: "Configurações",
      icon: <Feather name="settings" size={24} color={COLORS.textLight} />,
      action: () => navigation.push('/(more)/settings')
    },
    {
      title: "Ajuda & Suporte",
      icon: <MaterialCommunityIcons name="help-circle" size={24} color={COLORS.textLight} />,
      action: () => navigation.navigate('/(more)/help')
    },
    {
      title: "Sobre o Aplicativo",
      icon: <MaterialIcons name="info" size={24} color={COLORS.textLight} />,
      action: () => navigation.push('/(more)/about')
    }
  ];

  return (
    <View style={styles.container}>
      {/* Cabeçalho do perfil */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user?.avatarUrl || auth.currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }} 
          style={styles.profileImage}
        />
      
        <View style={styles.profileText}>
            <TouchableOpacity  onPress={() => navigation.push('/(more)/profile')} >
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção de opções principais */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRINCIPAIS</Text>
          {mainOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionCard}
              onPress={option.action}
            >
              <View style={styles.optionIconContainer}>
                {option.icon}
              </View>
              <Text style={styles.optionText}>{option.title}</Text>
              <MaterialIcons 
                name="keyboard-arrow-right" 
                size={24} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Seção de opções secundárias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OUTRAS OPÇÕES</Text>
          {secondaryOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionCard}
              onPress={option.action}
            >
              <View style={styles.optionIconContainer}>
                {option.icon}
              </View>
              <Text style={styles.optionText}>{option.title}</Text>
              <MaterialIcons 
                name="keyboard-arrow-right" 
                size={24} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner promocional */}
        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Seja Premium!</Text>
            <Text style={styles.promoText}>Acesso ilimitado a todos os testes e recursos avançados</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>ASSINAR AGORA</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={require('@/assets/images/security.png')} 
            style={styles.promoImage}
          />
        </View>
      </ScrollView>

      {/* Rodapé com versão do app */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.surface,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  profileText: {
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textLight
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.yellowLighten5
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 10,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: COLORS.textLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.yellowLighten5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500'
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: 'bold'
  },
  promoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden'
  },
  promoContent: {
    flex: 1,
    zIndex: 2
  },
  promoTitle: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  promoText: {
    color: COLORS.yellowLighten5,
    fontSize: 14,
    marginBottom: 15
  },
  promoButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  promoButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12
  },
  promoImage: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: 120,
    resizeMode: 'contain',
    opacity: 0.8
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center'
  },
  versionText: {
    color: COLORS.textLight,
    fontSize: 12
  }
});

export default MenuScreen;