import styled from "styled-components";

// Flex row is used for components that must remain in row in mobile view (or less than 900px)
export const FlexRow = styled.div`
  margin: ${({ margin }) => margin || "0"};
  width: ${({ w }) => w || "auto"};
  min-height: ${({ minh }) => minh || "auto"};
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  align-items: ${({ align }) => align || "left"};
  justify-content: ${({ justify }) => justify || "flex-start"};
  flex-wrap: ${({ wrap }) => wrap || "nowrap"};
`;
