import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <Spin
      indicator={antIcon}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default Loading;
