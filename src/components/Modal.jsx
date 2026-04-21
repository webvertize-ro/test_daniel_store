import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow:
    0,
    2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  border-radius: 1rem;
  transition: all 0.5s;
  z-index: 91;

  @media (max-width: 576px) {
    width: 320px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 1rem;
  border-bottom: 1px solid grey;
`;

const ModalContent = styled.div`
  @media (max-width: 576px) {
    /* max-height: 550px; */
    /* overflow-y: scroll; */
  }
`;

const StyledH4 = styled.h4`
  margin: 0;
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 100;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.2rem;
  border-radius: 5px;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #e5e7eb;
  }

  & svg {
    width: 1.2rem;
    height: 1.2rem;
    color: #6b7280;
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = setOpenName;

  // Disable scrolling when the modal is open
  useEffect(() => {
    if (openName) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [openName]);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name, title = 'Solicită o ofertă', lightboxOpen }) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick(lightboxOpen ? {} : openName ? close : {});

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Header>
          <StyledH4>{title}</StyledH4>
          <Button onClick={close}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Header>

        <ModalContent>
          {cloneElement(children, { onCloseModal: close })}
        </ModalContent>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
