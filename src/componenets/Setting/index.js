import React, { useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import styled from "styled-components";
import SettingCard from "./SettingCard";

const Container = styled.div`
  margin-top: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const CardContainer = styled.div`
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Setting = () => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));
  return (
    <>
      <Container>
        <CardContainer>
          {!["stu"].includes(userRole) && (
            <SettingCard
              iconSrc={<MdInfoOutline size={30} />}
              title={"تغییر اطلاعات"}
              color={userInfo?.data?.sex}
              path={"/changeInfo"}
            />
          )}
          <SettingCard
            iconSrc={<RiLockPasswordLine size={30} />}
            title={"تغییر رمز"}
            color={userInfo?.data?.sex}
            path={"/changePassword"}
          />
          {["ins"].includes(userRole) && (
            <SettingCard
              iconSrc={<MdOutlineVisibility size={30} />}
              title={"تغییر احتمال قبولی"}
              color={userInfo?.data?.sex}
              path={"/changeVisibilty"}
            />
          )}
        </CardContainer>
      </Container>
    </>
  );
};
export default Setting;
