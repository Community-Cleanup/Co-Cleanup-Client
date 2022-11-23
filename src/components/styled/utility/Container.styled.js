import styled from "styled-components";

// Container is a general purpose container that is highly customisable, 
// it is used often throughout the app to apply margin, text alignment, overflow etc
export const Container = styled.div`
  background-color: ${({ bg }) => bg || "white"};
  border-radius: ${({ br }) => br || "0"};
  height: ${({ h }) => h || "auto"};
  width: ${({ w }) => w || "400px"};
  margin: ${({ margin }) => margin || "0"};
  padding: ${({ pad }) => pad || "0"};
  position: ${({ position }) => position || "relative"};
  text-align: ${({ talign }) => talign || "left"};
  overflow-y: ${({ overflow }) => overflow || "auto"};

  @media (max-width: 900px) {
    width: ${({ wmobile }) => wmobile || "300px"};
  }
`;
