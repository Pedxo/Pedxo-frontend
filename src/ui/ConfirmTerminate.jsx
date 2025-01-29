import Button from "./Button";

function ConfirmTerminate({ onCloseModal, name }) {
  return (
    <div className="w-96 flex items-center py-2 px-4 flex-col gap-8">
      <h3 className="text-lg text-center font-semibold">Are you sure you want to terminate this contract?</h3>
      <p className="text-sm text-center bg-red-50 w-full font-semibold text-red-400 p-2">{name}</p>
      <div className="flex items-center justify-between w-full px-10 gap-10">
        <Button  type="danger">Terminate</Button>
        <button
          onClick={() => onCloseModal?.()}
          className="text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ConfirmTerminate;
