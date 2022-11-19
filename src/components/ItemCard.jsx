import React from "react";
import { theme } from "./styled/theme/Theme";
import { formatDate } from "../utils/formatDate";
import { CardSm } from "./styled/utility/CardSm.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Span } from "./styled/utility/Span.styled";
import { Button } from "./styled/elements/Button.styled";

function ItemCard(props) {
  return (
    <CardSm w="100%">
      <Flex align="flex-start" justify="space-between">
        <div>
          <h4>{props.title}</h4>
          <p>
            <Span
              fs="12px"
              fw="600"
              tf="uppercase"
              color={theme.colors.dateText}
            >
              {formatDate(props.date)}
            </Span>
          </p>
          <p>
            <Span fs="12px" margin="6px 0 0">
              {props.address}
            </Span>
          </p>
        </div>
        <Flex direction="column" align="flex-end">
          <Button
            w="70px"
            margin="0 0 4px"
            pad="6px 0px"
            bg={props.button1Color}
            onClick={props.button1Function}
          >
            {props.button1Text}
          </Button>
          {props.button2Text && (
            <Button
              w="70px"
              margin="0 0 4px"
              pad="6px 0px"
              bg={props.button2Color}
              onClick={props.button2Function}
            >
              {props.button2Text}
            </Button>
          )}
          {props.button3Text && (
            <Button
              w="70px"
              margin="0 0 4px"
              pad="6px 0px"
              bg={props.button3Color}
              onClick={props.button3Function}
            >
              {props.button3Text}
            </Button>
          )}
        </Flex>
      </Flex>
    </CardSm>
  );
}

export default ItemCard;
