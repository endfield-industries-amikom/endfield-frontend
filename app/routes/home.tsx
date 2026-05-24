import Nav from "~/components/Home/Nav";
import Footer from "~/components/Home/Footer";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

export default function Home() {
  return (
    <Fragment>
      <Nav />
      <Outlet />
      <Footer />
    </Fragment>
  );
}
