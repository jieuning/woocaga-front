import { Coordinates, initialType, MarkerInfo } from '../types/markers';

const getCoordinatesByCategory = (
  data: MarkerInfo[],
  category: string
): Coordinates[] => {
  const coordinates: Coordinates[] = [];

  data.forEach((marker) => {
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

export const coffeeCoordinates = (data: MarkerInfo[]) => {
  return getCoordinatesByCategory(data, '커피류');
};

export const dessertCoordinates = (data: MarkerInfo[]) => {
  return getCoordinatesByCategory(data, '디저트');
};
