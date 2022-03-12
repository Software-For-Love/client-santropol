import React from "react";
import SideBar from "./styles";
import Button from "../../Button";

const routes = [
  { label: "Kitchen AM", path: "/kitchen-am" },
  { label: "Kitchen PM", path: "/kitchen-pm" },
  { label: "Delivery", path: "/delivery" },
];

const index = () => {
  return (
    <SideBar>
      {routes.map(({ label, path }) => (
        <Button key={path} rounded fullWidth>
          {label}
        </Button>
      ))}
    </SideBar>
  );
};

export default index;
