import React, { useState, useEffect } from "react";
import Modal from "../../styles";
import PastShiftCard from "../../../Card/PastShiftCard";
import { Row, Col } from "antd";

const VolunteerPastShiftsModal = ({ visible, setVisible, volunteer, data }) => {
  const [pastShifts, setPastShifts] = useState(null);

  useEffect(() => {
    if (data) {
      setPastShifts(Object.values(data));
    }
  }, [data]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      title={`Past Shifts for ${volunteer.first_name} ${volunteer.last_name}`}
    >
      {pastShifts && (
        <Row>
          <Col>
            {pastShifts.map((shift) => (
              <PastShiftCard shift={shift} />
            ))}
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default VolunteerPastShiftsModal;
