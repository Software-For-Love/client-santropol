import React, { useState } from "react";
import { StyledInput, LeftArrow } from "../Profile/styles";
import { SearchContainer } from "./styles";
import { Row, Col, Typography, message } from "antd";
import LeftArrowIcon from "../../assets/left-arrow.svg";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import AxiosInstance from "../../API/api";

const Search = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [data, setData] = useState(null);

  console.log(data);

  const handleSearch = async () => {
    if (!name) {
      message.error("Please enter a name");
      return;
    }
    const firstName = name.split(" ")[0];
    const lastName = name.substring(firstName.length + 1);

    console.log(firstName, lastName);
    setSendingData(true);
    try {
      const response = await AxiosInstance.post("/user/retrieve-users", {
        first_name: "Indigo ",
        // last_name: lastName,
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
        {data && data.length > 0 && (
          <Row>
            {data.map((user) => (
              <Col span={8} key={user.uid}>
                <Typography.Text>{user.first_name}</Typography.Text>
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default Search;
