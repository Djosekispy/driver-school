import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { user } = useAuth()
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [wifiOnlyDownloads, setWifiOnlyDownloads] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const settingsSections = [
    {
      title: "Preferências",
      icon: <Feather name="settings" size={20} color={COLORS.primary} />,
      items: [
        {
          title: "Modo Escuro",
          icon: <MaterialIcons name="dark-mode" size={22} color={COLORS.text} />,
          action: (
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
          )
        },
        {
          title: "Idioma",
          icon: <Ionicons name="language" size={22} color={COLORS.text} />,
          action: (
            <View className="flex-row items-center">
              <Text style={{ color: COLORS.textLight }}>Português (AO)</Text>
              <AntDesign name="right" size={16} color={COLORS.textLight} style={{ marginLeft: 5 }} />
            </View>
          ),
          onPress: () => navigation.navigate('LanguageSettings')
        }
      ]
    },
    {
      title: "Notificações",
      icon: <Ionicons name="notifications" size={20} color={COLORS.primary} />,
      items: [
        {
          title: "Notificações Push",
          icon: <Ionicons name="notifications-outline" size={22} color={COLORS.text} />,
          action: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
          )
        },
        {
          title: "Lembretes de Estudo",
          icon: <MaterialIcons name="access-time" size={22} color={COLORS.text} />,
          action: <AntDesign name="right" size={16} color={COLORS.textLight} />,
          onPress: () => navigation.navigate('StudyReminders')
        }
      ]
    },
    {
      title: "Dados e Armazenamento",
      icon: <FontAwesome name="database" size={20} color={COLORS.primary} />,
      items: [
        {
          title: "Download apenas por Wi-Fi",
          icon: <Feather name="wifi" size={22} color={COLORS.text} />,
          action: (
            <Switch
              value={wifiOnlyDownloads}
              onValueChange={setWifiOnlyDownloads}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
          )
        },
        {
          title: "Limpar Cache",
          icon: <MaterialIcons name="delete" size={22} color={COLORS.text} />,
          action: <Text style={{ color: COLORS.textLight }}>1.2 GB</Text>,
          onPress: () => navigation.navigate('ClearCache')
        }
      ]
    },
    {
      title: "Privacidade",
      icon: <MaterialIcons name="privacy-tip" size={20} color={COLORS.primary} />,
      items: [
        {
          title: "Compartilhar Localização",
          icon: <Feather name="map-pin" size={22} color={COLORS.text} />,
          action: (
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
          )
        },
        {
          title: "Política de Privacidade",
          icon: <MaterialIcons name="policy" size={22} color={COLORS.text} />,
          action: <AntDesign name="right" size={16} color={COLORS.textLight} />,
          onPress: () => navigation.navigate('PrivacyPolicy')
        }
      ]
    },
    {
      title: "Conta",
      icon: <MaterialIcons name="account-circle" size={20} color={COLORS.primary} />,
      items: [
        {
          title: "Editar Perfil",
          icon: <Feather name="user" size={22} color={COLORS.text} />,
          action: <AntDesign name="right" size={16} color={COLORS.textLight} />,
          onPress: () => navigation.navigate('EditProfile')
        },
        {
          title: "Assinatura Premium",
          icon: <FontAwesome name="diamond" size={22} color={COLORS.text} />,
          action: <AntDesign name="right" size={16} color={COLORS.textLight} />,
          onPress: () => navigation.navigate('PremiumSubscription')
        },
        {
          title: "Sair da Conta",
          icon: <MaterialIcons name="logout" size={22} color="#e74c3c" />,
          action: <AntDesign name="right" size={16} color={COLORS.textLight} />,
          onPress: () => console.log("Sair da conta"),
          textColor: "#e74c3c"
        }
      ]
    }
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Cabeçalho */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 mr-2"
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: COLORS.primary }}>
          Configurações
        </Text>
        <View className="w-8" />
      </View>

      {/* Conteúdo principal */}
      <ScrollView className="flex-1 px-4 py-2" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Seção de perfil rápido */}
        <TouchableOpacity 
          className="flex-row items-center p-4 mb-4 rounded-lg border"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}
          onPress={() => navigation.navigate('Profile')}
        >
          <View 
            className="w-14 h-14 rounded-full justify-center items-center mr-3"
            style={{ backgroundColor: COLORS.yellowLighten5 }}
          >
            <FontAwesome name="user-circle" size={30} color={COLORS.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold" style={{ color: COLORS.text }}>
              {user?.name}
            </Text>
            <Text className="text-sm" style={{ color: COLORS.textLight }}>
             {user?.role.toUpperCase()}
            </Text>
          </View>
          <AntDesign name="right" size={16} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Seções de configurações */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <View className="flex-row items-center mb-3 ml-1">
              <View className="mr-2">
                {section.icon}
              </View>
              <Text className="text-base font-semibold" style={{ color: COLORS.primary }}>
                {section.title}
              </Text>
            </View>
            
            <View className="rounded-lg overflow-hidden border" style={{ borderColor: COLORS.border }}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  className={`flex-row items-center justify-between px-4 py-3 ${itemIndex !== section.items.length - 1 ? 'border-b' : ''}`}
                  style={{ 
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.surface
                  }}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="mr-3">
                      {item.icon}
                    </View>
                    <Text 
                      className="text-base"
                      style={{ color: item.textColor || COLORS.text }}
                    >
                      {item.title}
                    </Text>
                  </View>
                  {item.action}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Rodapé */}
        <View className="mt-4 px-2">
          <Text className="text-xs text-center" style={{ color: COLORS.textLight }}>
            DriveLearn v2.3.4 • Build 47
          </Text>
          <Text className="text-xs text-center mt-1" style={{ color: COLORS.textLight }}>
            © {new Date().getFullYear()} DriveLearn Angola. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;