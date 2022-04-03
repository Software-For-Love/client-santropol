import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SideBar, Layout, Header, Content } from "./components/Layout";
import Loading from "./components/Loading";
import { Row } from "antd";
import "./App.css";

// Pages
const KitchenAM = lazy(() => import("./pages/KitchenAM"));
const KitchenPM = lazy(() => import("./pages/KitchenPM"));
const Delivery = lazy(() => import("./pages/Delivery"));
const NormalLoginForm = lazy(() => import("./components/Users/login"));
const RegistrationForm = lazy(() => import("./components/Users/register"));

const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <Layout>
          <Header />
          <SideBar />
          <Content>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path='/kitchen-am' element={<KitchenAM />} />
                <Route path='/kitchen-pm' element={<KitchenPM />} />
                <Route path='/delivery' element={<Delivery />} />
                <Route
                  path='*'
                  element={<Navigate to='/kitchen-am' replace />}
                />
              </Routes>
            </Suspense>
          </Content>
        </Layout>
      ) : (
        <Row justify='center' align='middle' className='max-height'>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path='/' element={<NormalLoginForm />} />
              <Route path='/register' element={<RegistrationForm />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </Suspense>
        </Row>
      )}
    </BrowserRouter>
  );
};

export default AppRoutes;
