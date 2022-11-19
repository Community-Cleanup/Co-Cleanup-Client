import styled from "styled-components";

export const Flex = styled.div`
  margin: ${({ margin }) => margin || "0"};
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  align-items: ${({ align }) => align || "center"};
  justify-content: ${({ justify }) => justify || "flex-start"};

  & > div,
  & > ul {
    flex: 1;
  }
`;
