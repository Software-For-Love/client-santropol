import React, { useContext } from "react";
import Button from "../../../Button";
import Menu, { MenuText } from "./styles";
import { Dropdown } from "antd";
import { AuthContext } from "../../../../Contexts/AuthContext";

const MenuComponent = () => {
  const { logout } = useContext(AuthContext);
  return (
    <Menu openKeys={["profile"]}>
      <a href='/profile'>
        <Menu.Item key='profile'>
          <MenuText>Profile</MenuText>
        </Menu.Item>
      </a>
      <Menu.Divider />
      <Menu.Item key='logout' onClick={logout}>
        <MenuText>Log Out</MenuText>
      </Menu.Item>
    </Menu>
  );
};

const ProfileDropdown = () => {
  return (
    <Dropdown overlay={<MenuComponent />}>
      <Button type='primary' rounded>
        Jenny T.
      </Button>
    </Dropdown>
  );
};

export default ProfileDropdown;
