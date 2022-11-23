import styled from "styled-components";

// ImageBackground is used when a div with a background image is required
// the url is passed in props
export const ImageBackground = styled.div`
  background-image: url(${({ url }) => url});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 300px;
  width: 100%;
`;
