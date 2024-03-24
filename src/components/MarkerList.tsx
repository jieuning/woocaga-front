import { MarkerInfo } from '../types/markers';
import { IoTrashOutline } from 'react-icons/io5';

interface MakerListProps {
  marker?: MarkerInfo;
  setDeleteAddress: React.Dispatch<React.SetStateAction<string>>;
  setMarkerDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  myMarkerImage: string;
}

export const MarkerList = ({
  marker,
  setDeleteAddress,
  setMarkerDeleteModal,
  myMarkerImage,
}: MakerListProps) => {
  return (
    <>
      {marker && (
        <li className="flex items-center gap-2.5 border-b border-gray-200 pb-2.5 text-sm">
          <img className="w-6" src={myMarkerImage} alt="커피 마커" />
          <div className="flex justify-between items-center w-full">
            <span className="text-black">{marker.address}</span>
            <button
              onClick={() => {
                marker.address && setDeleteAddress(marker.address);
                setMarkerDeleteModal(true);
              }}
            >
              <IoTrashOutline color="#162220" size={18} />
            </button>
          </div>
        </li>
      )}
    </>
  );
};
