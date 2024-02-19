import { Coordinates, MarkerInfo } from '../types/markers';

export const coffeeCoordinates = (data: MarkerInfo[]) => {
  const coffee: Coordinates[] = [];

  // 카테고리가 커피인 위도, 경도
  data?.forEach((marker) => {
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

export const dessertCoordinates = (data: MarkerInfo[]) => {
  const dessert: Coordinates[] = [];

  // 카테고리가 디저트인 위도, 경도
  data?.forEach((marker) => {
    if (marker.category === '커피류') {
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
