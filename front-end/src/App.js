import "antd/dist/antd.css";
import { SideBar, Layout, Header } from "./components/Layout";

function App() {
  return (
    <Layout>
      <Header />
      <SideBar />
    </Layout>
  );
}

export default App;
