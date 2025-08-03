import { css } from "@emotion/react";

export const FontWeight = {
  Regular: "Regular",
  Meduim: "Meduim",
  Bold: "Bold",
  Light: "Light",
};

export const FontSize = {
  Title1: "32px",
  Title2: "28px",
  Title3: "24px",

  HeadLine: "20px",
  SubHeadLine: "18px",

  Body: "16px",
  Body2: "15px",

  Caption: "14px",
  Caption2: "12px",
  Caption3: "10px",
};

export const LineHeight = {
  Title1: "40px",
  Title2: "36px",
  Title3: "32px",

  HeadLine: "28px",
  SubHeadLine: "26px",

  Body: "24px",
  Body2: "24px",

  Caption: "22px",
  Caption2: "22px",
  Caption3: "22px",
}

export const getCssFontWeight = (weight) =>
  ({
    [FontWeight.Bold]: "bold",
    [FontWeight.Meduim]: "500",
    [FontWeight.Regular]: "normal",
    [FontWeight.Light]: "300",
  }[weight]);

export const TypoBaseStyle = (
  fontWeight = FontWeight.Regular
) => css`
  font-family: Shabnam;
  font-weight: ${getCssFontWeight(fontWeight)};
  margin: 0;
`;
