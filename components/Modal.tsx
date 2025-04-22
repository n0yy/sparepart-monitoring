export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-20">
      <div className="bg-base-100 rounded-lg shadow-lg p-6 w-4/5  max-h-[80vh] relative">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <div className="modal-content overflow-auto max-h-[calc(80vh-8rem)]">
          {children}
        </div>
        <button
          className="btn absolute top-4 right-4 px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
