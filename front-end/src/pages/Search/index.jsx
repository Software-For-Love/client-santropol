import React, { useState } from "react";
import { StyledInput, LeftArrow } from "../Profile/styles";
import { SearchContainer } from "./styles";
import { Row, Col, Typography, message } from "antd";
import LeftArrowIcon from "../../assets/left-arrow.svg";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import AxiosInstance from "../../API/api";
import VolunteerCard from "../../components/Card/VolunteerCard";

const Search = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    if (firstName === "" && lastName === "") {
      message.error("Please enter a name");
      return;
    }

    setSendingData(true);
    try {
      const { data } = await AxiosInstance.post("/user/retrieve-users", {
        first_name: firstName,
        last_name: lastName,
      });

      console.log(firstName, lastName);
      if (data.success) {
        if (data.result.length === 0) {
          message.error("No user found");
          setData(null);
        } else {
          setData(data.result);
        }
      } else {
        message.error(data.error);
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
            placeholder="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <StyledInput
            placeholder="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
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
        {data && data.length > 0 && (
          <Row
            gutter={[16, 16]}
            style={{
              padding: "1rem",
            }}
          >
            {data.map((user) => (
              <Col span={8} key={user.uid}>
                <VolunteerCard {...user} uid={user.key} />
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default Search;
