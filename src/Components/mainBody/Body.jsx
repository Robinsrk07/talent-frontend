import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

const Body = () => {
  return (
    <div className=" h-full w-full">
        <Header />
        <Outlet/>
        <Footer />
      
    </div>
  );
}

export default Body;