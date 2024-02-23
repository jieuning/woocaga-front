import { Coordinates, initialType } from '../types/markers';

export const coffeeCoordinates = (data: initialType) => {
  const coffee: Coordinates[] = [];

  // 카테고리가 커피인 위도, 경도
  data?.markerData?.forEach((marker) => {
    if (marker.category === '커피류') {
      marker.coordinates?.forEach((coordinates) => {
        coffee.push({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      });
    }
  });

  return coffee;
};

export const dessertCoordinates = (data: initialType) => {
  const dessert: Coordinates[] = [];

  // 카테고리가 디저트인 위도, 경도
  data?.markerData?.forEach((marker) => {
    if (marker.category === '디저트') {
      marker.coordinates?.forEach((coordinates) => {
        dessert.push({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      });
    }
  });

  return dessert;
};
