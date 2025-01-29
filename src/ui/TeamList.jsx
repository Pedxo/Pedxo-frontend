import Button from "./Button";
import ConfirmTerminate from "./ConfirmTerminate";
import Modal from "./Modal";

function TeamList({ info }) {
  const { name, image, country, position, pay, level } = info;
  return (
    <Modal>
      <li className="flex items-center capitalize text-sm text-center justify-between p-4 rounded-md border">
        <div className="flex items-center  w-48 gap-3">
          <figure
            className="w-10 h-10 rounded-full bg-white border"
            style={{
              backgroundImage: `url(${image})`,
              backgroundPosition: "center",
              backgroundSize: "center",
            }}
          ></figure>
          <span className="truncate">{name}</span>
        </div>
        <p className="w-48 truncate">{country}</p>
        <p className="w-48 truncate">{position}</p>
        <p className="w-32 truncate">${pay}</p>
        <p className="w-48 truncate">{level}</p>
        <div className="flex-shrink-0 flex justify-center w-24">
          <Modal.Open opens="terminate">
            <Button size="tiny" type="danger">
              Terminate
            </Button>
          </Modal.Open>
        </div>
      </li>
      <Modal.Window name="terminate">
        <ConfirmTerminate name={name} />
      </Modal.Window>
    </Modal>
  );
}

export default TeamList;
