import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { $api, infiniteQueryParams } from '../types/constants';
import { useEffect } from 'react';

export function useGroups() {
  const {data, isLoading, isError, hasNextPage, isFetching, fetchNextPage} = $api.useInfiniteQuery(
    "get",
    "/api/v1/groups/",
    {},
    infiniteQueryParams
  )

  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const groups = data?.pages.flatMap(page => page.results || page) || [];

  return {
    groups,
    isLoading,
    isError,
    rawData: data
  };
}

export async function pickImage() {
  // request camera roll permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    if (Platform.OS === 'android') {
      Alert.alert('Please grant camera roll permissions to upload an image.');
    } else {
      Alert.alert('Please grant camera roll permissions to upload an image.');
    }
    return null;
  }

  // image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [3, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
  return null;
};

