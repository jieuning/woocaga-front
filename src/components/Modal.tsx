import { addingMarkersToAMap } from '../utils/AddingMakersToAMap';

export const Modal = () => {
  return (
    <section className="modal-container w-full h-full z-10 bg-black bg-opacity-60">
      <div className="modal-container w-80 h-40 z-20 box-border bg-white rounded-md flex items-center justify-between flex-col p-2.5">
        <h3 className="pt-8">해당 구역에 마커를 추가하시겠습니까?</h3>
        <div className="flex w-full gap-2.5">
          <button className="modal-button bg-neutral-300">취소</button>
          <button className="modal-button bg-lightbrown">생성</button>
        </div>
      </div>
    </section>
  );
};
