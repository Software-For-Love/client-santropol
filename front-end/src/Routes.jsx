import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SideBar, Layout, Header } from "./components/Layout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Header />
        <SideBar />
        <Routes>
          <Route path='/'></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;
