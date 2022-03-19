import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SideBar, Layout, Header, Content } from "./components/Layout";
import Loading from "./components/Loading";

// Pages
const KitchenAM = lazy(() => import("./pages/KitchenAM"));
const KitchenPM = lazy(() => import("./pages/KitchenPM"));
const Delivery = lazy(() => import("./pages/Delivery"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Header />
        <SideBar />
        <Content>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path='/kitchen-am' element={<KitchenAM />} />
              <Route path='/kitchen-pm' element={<KitchenPM />} />
              <Route path='/delivery' element={<Delivery />} />
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;
