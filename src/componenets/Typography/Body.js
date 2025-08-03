import styled from "@emotion/styled";
import { forwardRef } from "react";
import { theme } from "../../constant/theme";
import { FontSize, LineHeight, TypoBaseStyle } from "./Base";

const TypoBase = styled.p`
  ${({ fontWeight }) => TypoBaseStyle(fontWeight)}
  color: ${({ color }) => color ?? theme.colors.dark[500]};
  & p {
    font-family: Shabnam;
    margin: 0;
  }
  &:hover {
    color: ${({ hover }) => hover};
  }
`;

const TypoInlineBase = styled.span`
  ${({ fontWeight }) => TypoBaseStyle(fontWeight)}
  color: ${({ color }) => color ?? theme.colors.dark[500]};
  & p {
    font-family: Shabnam;
    margin: 0;
  }
`;

export const Body = forwardRef((props, ref) => {
  const BaseComponent = props.inline ? TypoInlineBase : TypoBase;
  return (
    <BaseComponent
      {...props}
      style={{
        fontSize: FontSize.Body,
        lineHeight: LineHeight.Body,
        fontSize: "18px",
        ...props.style,
      }}
      ref={ref}
    />
  );
});

export const Body2 = forwardRef((props, ref) => {
  const BaseComponent = props.inline ? TypoInlineBase : TypoBase;
  return (
    <BaseComponent
      {...props}
      style={{
        fontSize: FontSize.Body2,
        lineHeight: LineHeight.Body2,
        ...props.style,
      }}
      ref={ref}
    />
  );
});

export const Caption = forwardRef((props, ref) => {
  const BaseComponent = props.inline ? TypoInlineBase : TypoBase;
  return (
    <BaseComponent
      {...props}
      style={{
        fontSize: FontSize.Caption,
        lineHeight: LineHeight.Caption,
        ...props.style,
      }}
      ref={ref}
    />
  );
});
