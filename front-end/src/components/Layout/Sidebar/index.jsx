import React, { useContext } from "react";
import { AuthContext } from "../../../Contexts/AuthContext";
import SideBar from "./styles";
import Button from "../../Button";
import { NavLink, useLocation } from "react-router-dom";

const volunteerRoutes = [
  { label: "Kitchen AM", path: "/kitchen-am" },
  { label: "Kitchen PM", path: "/kitchen-pm" },
  { label: "Delivery", path: "/delivery" },
];

const adminRoutes = [...volunteerRoutes, { label: "Search", path: "/search" }];

const SideBarComponent = () => {
  const location = useLocation();
  const { userType, user } = useContext(AuthContext);

  if (!user) {
    return null;
  }

  return (
    <SideBar xs={8} sm={8} md={6} lg={6} xl={5}>
      {userType === "admin"
        ? adminRoutes.map(({ label, path }) => (
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
          ))
        : volunteerRoutes.map(({ label, path }) => (
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
