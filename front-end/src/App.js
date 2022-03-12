import { useState } from "react";
import logo from "./santropol.svg";
import "./App.css";
import "antd/dist/antd.css";
import Button from "./components/Button";
import { Row, Col } from "antd";
import {
  AssignSlotOverlay,
  DeliveryOverlay,
  ClientDeliveryOverlay,
} from "./components/Modal";
import NormalLoginForm from "./components/Users/login";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [clientDeliveryModalVisible, setClientDeliveryModalVisible] =
    useState(false);

  return (

    <div className='App'>
      <header className='App-header'>
        <NormalLoginForm/>
        {/*<AssignSlotOverlay*/}
        {/*  visible={modalVisible}*/}
        {/*  setVisible={setModalVisible}*/}
        {/*/>*/}
        {/*<DeliveryOverlay*/}
        {/*  visible={deliveryModalVisible}*/}
        {/*  setVisible={setDeliveryModalVisible}*/}
        {/*/>*/}
        {/*<ClientDeliveryOverlay*/}
        {/*  visible={clientDeliveryModalVisible}*/}
        {/*  setVisible={setClientDeliveryModalVisible}*/}
        {/*/>*/}
        {/*<Row gutter={16}>*/}
        {/*  <Col>*/}
        {/*    <Button onClick={() => setModalVisible(true)}>Default</Button>*/}
        {/*  </Col>*/}
        {/*  <Col>*/}
        {/*    <Button*/}
        {/*      type='secondary'*/}
        {/*      rounded*/}
        {/*      onClick={() => setDeliveryModalVisible(true)}*/}
        {/*    >*/}
        {/*      Secondary*/}
        {/*    </Button>*/}
        {/*  </Col>*/}
        {/*  <Col>*/}
        {/*    <Button*/}
        {/*      type='tertiary'*/}
        {/*      onClick={() => setClientDeliveryModalVisible(true)}*/}
        {/*    >*/}
        {/*      Tertiary*/}
        {/*    </Button>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
      </header>
    </div>
  );
}

export default App;
