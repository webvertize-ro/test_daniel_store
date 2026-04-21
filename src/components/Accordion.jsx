import styled from 'styled-components';
import AccordionItem from './AccordionItem';
import { useState } from 'react';
import { useContent } from '../hooks/useContent';
import { c } from '../utils/content';

const StyledAccordion = styled.div`
  padding: 3rem 0;
  background-color: #1b3c53;

  @media (max-width: 576px) {
    padding: 1.5rem 0;
  }
`;

const StyledH2 = styled.h2`
  font-weight: 600;
  color: #fff;

  @media (max-width: 576px) {
    font-size: 1.6rem;
  }

  @media (min-width: 576px) and (max-width: 992px) {
    margin-bottom: 2rem;
  }
`;

const StyledP = styled.p`
  color: #fff;
  font-size: 1.2rem;
`;

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

function Accordion() {
  const [curOpen, setCurOpen] = useState(1);
  const { contentMap } = useContent();

  const cookies = [1, 2, 3, 4, 5].map((n) => ({
    number: c(contentMap, `cookies.accordion_item_${n}_number`),
    question: c(contentMap, `cookies.accordion_item_${n}_question`),
    answer: c(contentMap, `cookies.accordion_item_${n}_answer`),
  }));

  return (
    <StyledAccordion>
      <div className="container">
        <StyledH2>{c(contentMap, 'cookies.accordion_title')}</StyledH2>
        <AccordionContainer className="accordion" id="accordionExample">
          {cookies.map((cookie, index) => (
            <AccordionItem
              number={cookie.number}
              question={cookie.question}
              answer={cookie.answer}
              index={index + 1}
              curOpen={curOpen}
              onCurOpen={setCurOpen}
              links={cookie.links}
            />
          ))}
        </AccordionContainer>
      </div>
    </StyledAccordion>
  );
}

export default Accordion;
