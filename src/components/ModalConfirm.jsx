import React from "react";
import { Modal } from "./styled/utility/Modal.styled";
import { CenteredContainer } from "./styled/utility/CenteredContainer.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Button } from "./styled/elements/Button.styled";
import { theme } from "./styled/theme/Theme";

function ModalConfirm(props) {
  return (
    <Modal>
      <CenteredContainer w="500px">
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
      </CenteredContainer>
    </Modal>
  );
}

export default ModalConfirm;
