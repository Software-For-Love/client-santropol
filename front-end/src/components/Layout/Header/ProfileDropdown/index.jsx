import React from "react";
import Button from "../../../Button";
import Menu, { MenuText } from "./styles";
import { Dropdown } from "antd";

const menu = () => {
  return (
    <Menu openKeys={["profile"]}>
      <a href='/profile'>
        <Menu.Item key='profile'>
          <MenuText>Profile</MenuText>
        </Menu.Item>
      </a>
      <Menu.Divider />
      <Menu.Item key='logout'>
        <MenuText>Log Out</MenuText>
      </Menu.Item>
    </Menu>
  );
};

const ProfileDropdown = () => {
  return (
    <Dropdown overlay={menu}>
      <Button type='primary' rounded>
        Jenny T.
      </Button>
    </Dropdown>
  );
};

export default ProfileDropdown;
