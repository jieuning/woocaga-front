import { useAppSelector } from '../App';

export const MyMarkers = () => {
  const searchInfo = useAppSelector((state) => state.info.info);

  console.log(searchInfo);

  return (
    <section className="w-96 h-96 bg-white rounded-md">
      <ul>
        <li>하이</li>
      </ul>
    </section>
  );
};
