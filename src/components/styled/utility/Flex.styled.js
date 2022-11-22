import styled from "styled-components";

// Flex is used anytime flex is needed to be applied
// All these items will switch to column at a width less than 900px
export const Flex = styled.div`
  margin: ${({ margin }) => margin || "0"};
  width: ${({ w }) => w || "auto"};
  min-height: ${({ minh }) => minh || "auto"};
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  align-items: ${({ align }) => align || "left"};
  justify-content: ${({ justify }) => justify || "flex-start"};
  flex-wrap: ${({ wrap }) => wrap || "nowrap"};

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
  }
`;
