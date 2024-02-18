import { initialType, Coordinates } from '../types/markers';

export const coffeeCoordinates = (data: initialType) => {
  const coffee: Coordinates[] = [];

  // 카테고리가 커피인 위도, 경도
  data?.markerData?.forEach((marker) => {
    if (marker.category === '커피류') {
      marker.coordinates?.forEach((coordinate) => {
        coffee.push({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
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
      marker.coordinates?.forEach((coordinate) => {
        dessert.push({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        });
      });
    }
  });

  return dessert;
};
