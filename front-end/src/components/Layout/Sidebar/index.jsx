import React from "react";
import SideBar from "./styles";
import Button from "../../Button";
import { NavLink, useLocation } from "react-router-dom";

const routes = [
  { label: "Kitchen AM", path: "/kitchen-am" },
  { label: "Kitchen PM", path: "/kitchen-pm" },
  { label: "Delivery", path: "/delivery" },
];

const SideBarComponent = () => {
  const location = useLocation();

  return (
    <SideBar>
      {routes.map(({ label, path }) => (
        <NavLink
          to={path}
          key={path}
          style={{
            marginBottom: "0.5rem",
          }}
        >
          <Button
            key={path}
            rounded
            fullWidth
            isActive={location.pathname.includes(path)}
          >
            {label}
          </Button>
        </NavLink>
      ))}
    </SideBar>
  );
};

export default SideBarComponent;
