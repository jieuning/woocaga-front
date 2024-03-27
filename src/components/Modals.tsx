type ModalInfo = {
  content?: string;
  btntext?: string;
  lonclick?: (e?: any) => void;
  ronclick?: (e?: any) => void;
};

interface ModalProps {
  info: ModalInfo;
}

export const Modal = ({ info }: ModalProps) => {
  const { content, btntext, lonclick, ronclick } = info;

  return (
    <section className="font-['spoqa'] modal-container w-full h-screen z-50 bg-black bg-opacity-60">
      <div className="relative modal-container w-80 h-40 z-20 box-border bg-white rounded-md flex items-center justify-end flex-col p-2.5 modal-width">
        <h3 className="absolute top-1/3 -translate-y-1/2 text-center text-black break-keep whitespace-pre-line">
          {content}
        </h3>
        <div className="flex w-full gap-2.5">
          <button
            onClick={(event) => {
              event.stopPropagation();
              lonclick?.();
            }}
            className="modal-button bg-neutral-300 text-black"
          >
            취소
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              ronclick?.();
            }}
            className="modal-button bg-lightbrown text-black"
          >
            {btntext}
          </button>
        </div>
      </div>
    </section>
  );
};

export type { ModalInfo };
