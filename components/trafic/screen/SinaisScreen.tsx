import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  SectionList, 
  Keyboard,
  FlatList,
  ListRenderItem,
  SectionListRenderItem,
  SectionListData
} from 'react-native';
import { ChevronRight, Search, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { CategoriaSinal, sinaisPorCategoria, SinalTransito } from '../types/signal';


// Todos os sinais para busca
const todosSinais: SinalTransito[] = sinaisPorCategoria.flatMap(categoria => categoria.data);

export default function SinaisScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSinais, setFilteredSinais] = useState<CategoriaSinal[]>(sinaisPorCategoria);
  const [suggestions, setSuggestions] = useState<SinalTransito[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sinaisPorCategoria.reduce((acc, categoria) => {
      acc[categoria.title] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );
  const searchRef = useRef<TextInput>(null);

  // Alternar expansão de seção
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Busca com autocomplete
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSinais(sinaisPorCategoria);
      setSuggestions([]);
    } else {
      // Filtra sinais para sugestões
      const matched = todosSinais.filter(sinal =>
        sinal.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(matched.slice(0, 5));

      // Filtra para a lista principal
      const filtered = sinaisPorCategoria
        .map(categoria => ({
          ...categoria,
          data: categoria.data.filter(sinal =>
            sinal.nome.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }))
        .filter(categoria => categoria.data.length > 0);
      
      setFilteredSinais(filtered);
    }
  }, [searchQuery]);

  const handleSelectSuggestion = (sinal: SinalTransito) => {
    setSearchQuery(sinal.nome);
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const renderSinalItem: ListRenderItem<SinalTransito> = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center px-6 py-4 mx-4 my-1 rounded-lg"
      style={{ 
        backgroundColor: COLORS.blue.lighten5,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.blue.accent3
      }}
      onPress={() => router.push({pathname : '/(details)/signal', params:{id : item.id }})}
    >
      <Image
        source={{ uri: item.imagem }}
        className="w-12 h-12 mr-4"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text className="font-bold" style={{ color: COLORS.blue.darken4 }}>
          {item.nome}
        </Text>
        <Text 
          className="text-xs mt-1" 
          style={{ color: COLORS.blue.darken2 }}
        >
          {item.descricaoBreve}
        </Text>
      </View>
      <ChevronRight size={20} color={COLORS.blue.darken2} />
    </TouchableOpacity>
  );

  const renderSectionHeader: SectionListRenderItem<SinalTransito, CategoriaSinal> = ({ section: { title } }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between px-6 py-3 bg-white mx-4 mt-4 rounded-t-lg"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: COLORS.blue.lighten3
      }}
      onPress={() => toggleSection(title)}
    >
      <Text className="font-bold" style={{ color: COLORS.blue.darken4 }}>
        {title}
      </Text>
      {expandedSections[title] ? (
        <ChevronUp size={20} color={COLORS.blue.darken2} />
      ) : (
        <ChevronDown size={20} color={COLORS.blue.darken2} />
      )}
    </TouchableOpacity>
  );

  const renderSectionFooter = ({ section: { title } }: { section: SectionListData<SinalTransito, CategoriaSinal> }) => {
    if (expandedSections[title] !== false) return null;
    
    return (
      <View className="px-6 py-2 bg-white mx-4 rounded-b-lg">
        <Text 
          className="text-sm text-center"
          style={{ color: COLORS.text.secondary }}
        >
          Toque para expandir
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <View className="px-6 py-4" style={{ backgroundColor: COLORS.blue.darken3 }}>
        <Text className="text-2xl font-bold" style={{ color: COLORS.text.light }}>
          Sinais de Trânsito
        </Text>
        <Text className="text-sm mt-1" style={{ color: COLORS.blue.lighten4 }}>
          Legislação Angolana - Organizado por Categoria
        </Text>
      </View>

      {/* Barra de Pesquisa */}
      <View className="px-4 py-3 relative">
        <View 
          className="flex-row items-center rounded-lg px-4 py-2" 
          style={{ 
            backgroundColor: COLORS.blue.lighten5,
            borderWidth: 1,
            borderColor: COLORS.blue.lighten3
          }}
        >
          <Search size={18} color={COLORS.blue.darken2} />
          <TextInput
            ref={searchRef}
            placeholder="Pesquisar sinal..."
            className="flex-1 ml-2"
            placeholderTextColor={COLORS.blue.darken1}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Sugestões de Autocomplete */}
        {suggestions.length > 0 && (
          <View 
            className="absolute left-4 right-4 top-16 bg-white rounded-lg z-10 shadow-lg"
            style={{
              borderWidth: 1,
              borderColor: COLORS.blue.lighten2,
              maxHeight: 200
            }}
          >
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-4 py-3 border-b"
                  style={{ borderColor: COLORS.blue.lighten5 }}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Text style={{ color: COLORS.text.primary }}>{item.nome}</Text>
                  <Text 
                    className="text-xs mt-1" 
                    style={{ color: COLORS.text.secondary }}
                  >
                    {item.descricaoBreve}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Lista de Sinais por Categoria */}
      <SectionList
        sections={filteredSinais}
        keyExtractor={(item) => item.id}
        renderItem={renderSinalItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        SectionSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-lg" style={{ color: COLORS.text.secondary }}>
              Nenhum sinal encontrado
            </Text>
          </View>
        }
        stickySectionHeadersEnabled={false}
        getItemLayout={(data, index) => (
          { length: 80, offset: 80 * index, index }
        )}
      />
    </View>
  );
}