import { useContext, cloneElement, useState, useRef } from "react";
import { HiX } from "react-icons/hi";
import { createContext } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useGSAP } from "@gsap/react"; 
import gsap from "gsap"; 

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => {
    setOpenName("");
  };

  const open = (name) => {
    if (openName === "") {
      setOpenName(name);
    }
  };

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const modalRef = useRef(null);
  const ref = useOutsideClick(() => handleCloseAnimation());

  const handleCloseAnimation = () => {
    gsap.to(modalRef.current, {
      y: 2000, 
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: close, 
    });
  };

  useGSAP(() => {
    if (name === openName) {
      gsap.to(modalRef.current, {
        y: 0,
        opacity: 1, 
        duration: 0.1,
        ease: "power2.in",
      });
    }
  }, [openName, name]);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={(el) => {
          modalRef.current = el;
          ref.current = el;
        }}
        className="relative mx-auto opacity-0 translate-y-20 flex items-center justify-center rounded-lg bg-white p-6 shadow-lg transition-all duration-500"
      >
        <button
          className="absolute right-3 top-3"
          onClick={handleCloseAnimation}
        >
          <HiX size={21} color="black" />
        </button>
        {cloneElement(children, { onCloseModal: handleCloseAnimation })}
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;