import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
       
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização negada');
          Alert.alert(
            'Permissão Necessária',
            'Este app precisa de acesso à sua localização para funcionar.'
          );
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        setLocation(currentLocation);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setErrorMsg('Erro ao obter localização');
        setLoading(false);
      }
    })();
  }, []);

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        
        latitude: -22.9099,
        longitude: -47.0626,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Obtendo sua localização...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg && !location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          <Text style={styles.errorSubtext}>
            O app mostrará a localização padrão (Campinas)
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        loadingEnabled={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Minha Localização Atual"
            description="Você está aqui!"
            pinColor="blue"
          />
        )}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});