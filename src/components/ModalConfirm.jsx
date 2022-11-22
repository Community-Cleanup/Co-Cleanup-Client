import React from "react";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { Modal } from "./styled/utility/Modal.styled";
import { Container } from "./styled/utility/Container.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Button } from "./styled/elements/Button.styled";

// This component is used to display a modal yes/no confirm message
// It can be passed props to customise the message and the button text
function ModalConfirm(props) {
  // styled components are passed props to help fine tune different css properties
  return (
    <Modal>
      <Container w="500px" br="10px" pad="36px" margin="150px auto">
        <Flex direction="column" w="min-content">
          <p>{props.message}</p>
          <p>Are you sure?</p>
          <Flex margin="16px 0 0">
            <Button w="50%" onClick={props.buttonYesFunction}>
              {props.buttonYesText}
            </Button>
            <Button
              w="50%"
              bg={theme.colors.buttonCancel}
              onClick={props.buttonNoFunction}
            >
              {props.buttonNoText}
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Modal>
  );
}

export default ModalConfirm;
