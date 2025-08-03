import React from "react";
import { BallTriangle } from "react-loader-spinner";
import styled from "styled-components";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 100%;
`;

const Loader = ({ color }) => {
  return (
    <LoaderWrapper>
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color={color}
        ariaLabel="ball-triangle-loading"
        visible={true}
      />
    </LoaderWrapper>
  );
};

export default Loader;