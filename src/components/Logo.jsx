import styled from 'styled-components';
import logoImg from '../assets/images/basic-business-logo.svg';
import { useContent } from '../hooks/useContent';
import { c } from '../utils/content';

const StyledImg = styled.img`
  max-width: ${(props) => (props.width ? props.width : '160px')};
  max-height: 60px;
`;

function Logo({ width }) {
  const { contentMap, isLoading, error } = useContent();

  return <StyledImg width={width} src={c(contentMap, 'global.logo')} />;
}

export default Logo;
