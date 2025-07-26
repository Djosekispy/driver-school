import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { AntDesign, Feather, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { User, UserRole } from '@/types/User';
import { useFirebase } from '@/context/FirebaseContext';

const UserManagement = () => {
  const { 
    users, 
    loadUsers, 
    modifyUser,
    removeUser
  } = useFirebase();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'todos'>('todos');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadUsers();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeUser(id);
              Alert.alert('Sucesso', 'Usuário excluído com sucesso');
              setModalVisible(false);
            } catch (error) {
              console.error('Erro ao excluir usuário:', error);
              Alert.alert('Erro', 'Falha ao excluir usuário');
            }
          },
        },
      ]
    );
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await modifyUser(userId, { role: newRole });
      Alert.alert('Sucesso', `Permissões do usuário atualizadas para ${newRole === 'admin' ? 'Administrador' : 'Normal'}`);
      loadUsers(); // Recarrega a lista de usuários
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      Alert.alert('Erro', 'Falha ao atualizar permissões do usuário');
    }
  };

  const handleUserPreview = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const getRoleStyle = (role: UserRole) => {
    return role === 'admin' 
      ? { bg: COLORS.primary, text: 'white' }
      : { bg: COLORS.border, text: COLORS.text };
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.name?.toLowerCase().includes(searchQuery?.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchQuery?.toLowerCase()
    ));
    const matchesRole = selectedRole === 'todos' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roles = [
    { id: 'todos', name: 'Todos' },
    { id: 'admin', name: 'Administradores' },
    { id: 'normal', name: 'Usuários Normais' }
  ];

  const renderItem = ({ item }: { item: User }) => {
    const roleStyle = getRoleStyle(item.role);

    return (
      <TouchableOpacity 
        className="flex-row items-center p-4 mb-3 rounded-lg shadow-sm"
        style={{ backgroundColor: COLORS.surface }}
        activeOpacity={0.8}
        onPress={() => handleUserPreview(item)}
      >
        {/* Avatar do usuário */}
        <View className="relative">
          <View className="w-14 h-14 rounded-full items-center justify-center overflow-hidden" 
            style={{ backgroundColor: COLORS.background }}>
            {item.avatarUrl ? (
              <Image 
                source={{ uri: item.avatarUrl }} 
                className="w-full h-full"
              />
            ) : (
              <MaterialCommunityIcons 
                name="account" 
                size={28} 
                color={COLORS.textLight} 
              />
            )}
          </View>
          <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full items-center justify-center border-2 border-white"
            style={{ backgroundColor: roleStyle.bg }}>
            <MaterialIcons 
              name={item.role === 'admin' ? 'admin-panel-settings' : 'person'} 
              size={12} 
              color={roleStyle.text} 
            />
          </View>
        </View>

        {/* Informações do usuário */}
        <View className="flex-1 ml-4">
          <Text className="text-base font-semibold" numberOfLines={1}
            style={{ color: COLORS.text }}>
            {item.name}
          </Text>
          <Text className="text-sm mt-1" numberOfLines={1}
            style={{ color: COLORS.textLight }}>
            {item.email}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-xs px-2 py-1 rounded-full mr-2"
              style={{ 
                backgroundColor: roleStyle.bg, 
                color: roleStyle.text 
              }}>
              {item.role === 'admin' ? 'Administrador' : 'Usuário Normal'}
            </Text>
            <Text className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Ícone de ação */}
        <Feather name="chevron-right" size={18} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="mt-4" style={{ color: COLORS.text }}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 bg-white shadow-sm"
        style={{ paddingTop: Platform.OS === 'ios' ? 50 : 16 }}>
        <Text className="text-2xl font-bold mb-4" style={{ color: COLORS.text }}>
          Gerenciamento de Usuários
        </Text>
        
        {/* Barra de pesquisa */}
        <View className="flex-row items-center px-3 py-2 rounded-lg mb-3"
          style={{ backgroundColor: COLORS.surface }}>
          <Feather name="search" size={18} color={COLORS.textLight} />
          <TextInput
            className="flex-1 ml-2 text-base"
            style={{ color: COLORS.text }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Pesquisar usuários..."
            placeholderTextColor={COLORS.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AntDesign name="close" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros de permissão */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-2"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {roles.map(role => (
            <TouchableOpacity
              key={role.id}
              className={`px-4 py-2 rounded-full mr-2 ${selectedRole === role.id ? 'opacity-100' : 'opacity-70'}`}
              style={{ 
                backgroundColor: 
                  role.id === 'todos' ? COLORS.border :
                  role.id === 'admin' ? COLORS.primary :
                  COLORS.secondary
              }}
              onPress={() => setSelectedRole(role.id as UserRole | 'todos')}
            >
              <Text 
                className="text-xs font-medium"
                style={{ 
                  color: role.id === 'todos' ? COLORS.text : 'white'
                }}
              >
                {role.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Estatísticas rápidas */}
      <View className="flex-row justify-between px-4 py-3 bg-white mb-1">
        <View className="items-center">
          <Text className="text-lg font-bold" style={{ color: COLORS.primary }}>
            {users.filter(u => u.role === 'admin').length}
          </Text>
          <Text className="text-xs" style={{ color: COLORS.textLight }}>Administradores</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold" style={{ color: COLORS.secondary }}>
            {users.filter(u => u.role === 'normal').length}
          </Text>
          <Text className="text-xs" style={{ color: COLORS.textLight }}>Usuários Normais</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
            {users.length}
          </Text>
          <Text className="text-xs" style={{ color: COLORS.textLight }}>Total</Text>
        </View>
      </View>

      {/* Lista de usuários */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        className="px-4 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-4 rounded-lg mx-4 mt-4"
            style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <Ionicons 
              name="people-outline" 
              size={48} 
              color={COLORS.yellowDarken2} 
            />
            <Text className="text-lg mt-4 text-center"
              style={{ color: COLORS.textLight }}>
              Nenhum usuário encontrado
            </Text>
            <Text className="text-sm mt-1 text-center"
              style={{ color: COLORS.textLight }}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Nenhum usuário cadastrado'}
            </Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={loadUsers}
      />

      {/* Modal de detalhes do usuário */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/90 p-4"
          style={Platform.OS === 'ios' ? { paddingTop: 60 } : {}}>
          <TouchableOpacity 
            className="absolute top-4 right-4 z-10 p-2"
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>

          {selectedUser && (
            <View className="bg-white rounded-2xl max-h-[80%]">
              <ScrollView 
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Cabeçalho com avatar */}
                <View className="items-center py-6 border-b"
                  style={{ borderBottomColor: COLORS.border }}>
                  <View className="relative mb-4">
                    <View className="w-24 h-24 rounded-full items-center justify-center overflow-hidden" 
                      style={{ backgroundColor: COLORS.background }}>
                      {selectedUser.avatarUrl ? (
                        <Image 
                          source={{ uri: selectedUser.avatarUrl }} 
                          className="w-full h-full"
                        />
                      ) : (
                        <MaterialCommunityIcons 
                          name="account" 
                          size={48} 
                          color={COLORS.textLight} 
                        />
                      )}
                    </View>
                    <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                      style={{ 
                        backgroundColor: getRoleStyle(selectedUser.role).bg 
                      }}>
                      <MaterialIcons 
                        name={selectedUser.role === 'admin' ? 'admin-panel-settings' : 'person'} 
                        size={14} 
                        color={getRoleStyle(selectedUser.role).text} 
                      />
                    </View>
                  </View>
                  
                  <Text className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
                    {selectedUser.name}
                  </Text>
                  <Text className="text-base mb-3" style={{ color: COLORS.primary }}>
                    {selectedUser.email}
                  </Text>
                  <View 
                    className="px-4 py-1 rounded-full"
                    style={{ 
                      backgroundColor: getRoleStyle(selectedUser.role).bg 
                    }}>
                    <Text className="text-sm font-semibold"
                      style={{ 
                        color: getRoleStyle(selectedUser.role).text 
                      }}>
                      {selectedUser.role === 'admin' ? 'Administrador' : 'Usuário Normal'}
                    </Text>
                  </View>
                </View>

                {/* Detalhes do usuário */}
                <View className="p-5">
                  <View className="mb-6">
                    <Text className="text-sm uppercase font-semibold mb-2"
                      style={{ color: COLORS.textLight }}>
                      Informações do Usuário
                    </Text>
                    
                    <View className="flex-row justify-between py-3 border-b"
                      style={{ borderBottomColor: COLORS.border }}>
                      <Text className="text-base" style={{ color: COLORS.textLight }}>
                        Cadastrado em
                      </Text>
                      <Text className="text-base font-medium" style={{ color: COLORS.text }}>
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    {selectedUser.phone && (
                      <View className="flex-row justify-between py-3 border-b"
                        style={{ borderBottomColor: COLORS.border }}>
                        <Text className="text-base" style={{ color: COLORS.textLight }}>
                          Telefone
                        </Text>
                        <Text className="text-base font-medium" style={{ color: COLORS.text }}>
                          {selectedUser.phone}
                        </Text>
                      </View>
                    )}
                    
                    {selectedUser.address && (
                      <View className="flex-row justify-between py-3"
                        style={{ borderBottomColor: COLORS.border }}>
                        <Text className="text-base" style={{ color: COLORS.textLight }}>
                          Endereço
                        </Text>
                        <Text className="text-base font-medium text-right flex-1 ml-4" 
                          style={{ color: COLORS.text }}>
                          {selectedUser.address}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Alteração de permissões */}
                  <View>
                    <Text className="text-sm uppercase font-semibold mb-3"
                      style={{ color: COLORS.textLight }}>
                      Permissões do Usuário
                    </Text>
                    
                    <View className="flex-row justify-between items-center py-3">
                      <View>
                        <Text className="text-base font-medium" style={{ color: COLORS.text }}>
                          Nível de Acesso
                        </Text>
                        <Text className="text-sm" style={{ color: COLORS.textLight }}>
                          {selectedUser.role === 'admin' 
                            ? 'Acesso total ao sistema' 
                            : 'Acesso limitado'}
                        </Text>
                      </View>
                      
                      <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${selectedUser.role === 'admin' ? 'bg-red-100' : 'bg-green-100'}`}
                        onPress={() => handleRoleChange(
                          selectedUser.id, 
                          selectedUser.role === 'admin' ? 'normal' : 'admin'
                        )}
                      >
                        <Text 
                          className="text-sm font-semibold"
                          style={{ 
                            color: selectedUser.role === 'admin' 
                              ? COLORS.error 
                              : COLORS.success 
                          }}
                        >
                          {selectedUser.role === 'admin' 
                            ? 'Rebaixar para Normal' 
                            : 'Tornar Administrador'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Ações */}
              <View className="flex-row justify-between border-t p-4"
                style={{ borderTopColor: COLORS.border }}>
                <TouchableOpacity 
                  className="flex-row items-center px-5 py-2"
                  onPress={() => {
                    setModalVisible(false);
                    router.push({ 
                      pathname: '/(admin)/edit-user', 
                      params: { id: selectedUser.id } 
                    });
                  }}
                >
                  <Feather name="edit" size={18} color={COLORS.primary} />
                  <Text className="ml-2 text-base font-medium" style={{ color: COLORS.primary }}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center px-5 py-2"
                  onPress={() => handleDelete(selectedUser.id)}
                >
                  <AntDesign name="delete" size={18} color={COLORS.error} />
                  <Text className="ml-2 text-base font-medium" style={{ color: COLORS.error }}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default UserManagement;