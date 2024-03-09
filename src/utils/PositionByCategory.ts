import { Coordinates, initialType } from '../types/markers';

const getCoordinatesByCategory = (
  data: initialType,
  category: string
): Coordinates[] => {
  const coordinates: Coordinates[] = [];

  data?.markerData?.forEach((marker) => {
    if (marker.category === category) {
      marker.coordinates?.forEach((coordinate) => {
        coordinates.push({
          address: marker.address,
          useremail: marker.useremail,
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          x: coordinate.x,
          y: coordinate.y,
        });
      });
    }
  });

  return coordinates;
};

export const coffeeCoordinates = (data: initialType) => {
  return getCoordinatesByCategory(data, '커피류');
};

export const dessertCoordinates = (data: initialType) => {
  return getCoordinatesByCategory(data, '디저트');
};
