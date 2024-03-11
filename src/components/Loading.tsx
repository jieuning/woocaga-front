import BeatLoader from 'react-spinners/BeatLoader';

export const Loading = () => {
  return (
    <BeatLoader
      color="#52FFA8"
      size={12}
      speedMultiplier={2}
      margin={5}
      className="mt-9 mb-12"
    />
  );
};
