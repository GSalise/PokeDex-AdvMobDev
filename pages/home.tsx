import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { usePokeDexApi } from '../hook/usePokeDexApi';
import LinearGradient from 'react-native-linear-gradient';

function getPokemonImageUrl(url: string) {
  // Extract the Pokémon ID from the URL
  const idMatch = url.match(/\/pokemon\/(\d+)\//);
  const id = idMatch ? idMatch[1] : '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function Home() {
  const [offset, setOffset] = useState(0);
  const { data, isLoading, error, isRefetching, refetch } = usePokeDexApi(
    20,
    offset,
  );

  if (isLoading) {
    return (
      <LinearGradient colors={['#ff0000', '#fff']} style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size={64} color="#ff0000" />
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#ff0000', '#fff']} style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Error loading Pokédex.</Text>
        </View>
      </LinearGradient>
    );
  }

  const handleRefresh = () => {
    const maxOffset = 1328 - 28;
    const newOffset = Math.floor(Math.random() * maxOffset);
    setOffset(newOffset);
    refetch();
  };

  return (
    <LinearGradient colors={['#ff0000', '#fff']} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Pokédex</Text>
        <FlatList
          data={data?.results}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: getPokemonImageUrl(item.url) }}
                style={styles.image}
              />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.flavor_text, { marginTop: 10 }]}>
                {item.flavor_text}
              </Text>
            </View>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{}}
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  innerContainer: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    height: 400,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 12,
    // borderColor: 'red',
    // borderWidth: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'left',
    textTransform: 'capitalize',
  },
  flavor_text: {
    fontSize: 12,
    fontStyle: 'italic',
    width: '80%',
    // borderColor: 'red',
    // borderWidth: 4,
    textAlign: 'left',
  },
});
