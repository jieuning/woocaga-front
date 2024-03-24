import { kakao } from '../App';

export const markerImageCustom = (
  category: string,
  coffeeImage: string,
  dessertImage: string
) => {
  const imageSrc = category !== '디저트' ? coffeeImage : dessertImage;
  const imageSize = new kakao.maps.Size(32, 42);
  const imageOption = { offset: new kakao.maps.Point(15, 42) };
  return new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
};
