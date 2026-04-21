import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { useContent } from '../hooks/useContent';
import { c } from '../utils/content';
import { useOutsideClick } from '../hooks/useOutsideClick';

const StyledCookiePopup = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background-color: #7fa5b8;
  color: #fff;
  font-weight: 600;
  display: flex;
  gap: 0.75rem;
  z-index: 9999;
`;

const Text = styled.div`
  flex: 4;
`;

const Button = styled(Link)`
  text-decoration: none;
  background-color: #142b3e;
  color: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

function CookiePopup() {
  const { contentMap } = useContent();

  const [popupOpen, setPopupOpen] = useState(
    localStorage.getItem('acceptedCookies') !== 'true',
  );

  function handlePopup() {
    setPopupOpen(false);
    localStorage.setItem('acceptedCookies', 'true');
  }

  if (!popupOpen) return;

  return (
    popupOpen && (
      <StyledCookiePopup>
        <div className="container">
          <Text>{c(contentMap, 'global.cookie-pop-up-paragraph')}</Text>
          <ButtonsContainer className="d-flex gap-1">
            <Button onClick={() => handlePopup()} className="ok-cookie-pop-up">
              {c(contentMap, 'global.cookie-pop-up-button-1-text')}
            </Button>
            <Button to={c(contentMap, 'global.cookie-pop-up-button-2-route')}>
              {c(contentMap, 'global.cookie-pop-up-button-2-text')}
            </Button>
          </ButtonsContainer>
        </div>
      </StyledCookiePopup>
    )
  );
}

export default CookiePopup;
