import React from "react";
import { theme } from "./styled/theme/Theme";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Span } from "./styled/utility/Span.styled";

function AdminEventsItemCard(props) {
  return (
    <CardLg margin="10px" maxw="100%" bord="1px solid black">
      <FlexRow align="flex-start" justify="space-between">
        <Flex direction="column" align="flex-end" margin="10px">
          <Span fs="18px" fw="1000">
            {props.title}
          </Span>
          <p>
            <Span
              fs="14px"
              fw="800"
              tf="uppercase"
              color={theme.colors.dateText}
            >
              {props.date}
            </Span>
          </p>
          <p>
            <Span fs="12px" margin="6px 0 0">
              {props.address}
            </Span>
          </p>
        </Flex>

        <Flex direction="column" align="flex-end" margin="10px" w="200px">
          {props.adminDeleteEventForm}
          {props.adminShowComments}
        </Flex>
      </FlexRow>
    </CardLg>
  );
}

export default AdminEventsItemCard;
