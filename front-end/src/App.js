import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import Button from "./components/Button";
import { Row, Col } from "antd";
import {
  AssignSlotOverlay,
  DeliveryOverlay,
  ClientDeliveryOverlay,
} from "./components/Modal";

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [clientDeliveryModalVisible, setClientDeliveryModalVisible] =
    useState(false);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <AssignSlotOverlay
          visible={modalVisible}
          setVisible={setModalVisible}
        />
        <DeliveryOverlay
          visible={deliveryModalVisible}
          setVisible={setDeliveryModalVisible}
        />
        <ClientDeliveryOverlay
          visible={clientDeliveryModalVisible}
          setVisible={setClientDeliveryModalVisible}
        />
        <Row gutter={16}>
          <Col>
            <Button onClick={() => setModalVisible(true)}>Default</Button>
          </Col>
          <Col>
            <Button
              type='secondary'
              rounded
              onClick={() => setDeliveryModalVisible(true)}
            >
              Secondary
            </Button>
          </Col>
          <Col>
            <Button
              type='tertiary'
              onClick={() => setClientDeliveryModalVisible(true)}
            >
              Tertiary
            </Button>
          </Col>
        </Row>
      </header>
    </div>
  );
}

export default App;
