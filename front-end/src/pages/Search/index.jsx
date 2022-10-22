import React, { useState, useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { StyledInput, LeftArrow } from "../Profile/styles";
import { SearchContainer } from "./styles";
import { Row, Col, Typography, message } from "antd";
import LeftArrowIcon from "../../assets/left-arrow.svg";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import AxiosInstance from "../../API/api";

const Search = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    if (!name) {
      message.error("Please enter a name");
      return;
    }
    setSendingData(true);
    try {
      const response = await AxiosInstance.get("/events/getUserPastEvents", {
        uid: user.uid,
      });
      if (response.data.length === 0) {
        message.error("No results found");
      } else {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setSendingData(false);
  };

  return (
    <Row style={{ height: "100%" }}>
      <Col span={2}>
        <LeftArrow
          src={LeftArrowIcon}
          alt="go-back"
          onClick={() => navigate(-1)}
        />
      </Col>
      <Col
        span={22}
        style={{
          backgroundColor: "rgba(143, 50, 122, 0.3)",
          borderRadius: "10px",
        }}
      >
        <SearchContainer>
          <Typography.Text strong>Search:</Typography.Text>
          <StyledInput
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Button
            rounded
            loading={sendingData}
            style={{
              marginTop: "1rem",
              padding: "1rem 1.5rem",
            }}
            onClick={handleSearch}
          >
            Go!
          </Button>
        </SearchContainer>
      </Col>
    </Row>
  );
};

export default Search;
