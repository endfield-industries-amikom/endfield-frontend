import Footer from "~/components/layout/Footer";
import Navbar from "~/components/layout/Navbar";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

export default function Home() {
  return (
    <Fragment>
      <Navbar />
      <Outlet />
      <Footer />
    </Fragment>
  );
}
