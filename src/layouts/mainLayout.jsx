import React from "react";
import { Helmet } from "react-helmet";
import Navigation from "../components/Navigation";
import Perfil from "../components/perfil";

function MainLayout({ title, children, items }) {
  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {items ? (
        <header className="fixed">
          <Navigation items={items} perfil={<Perfil />} />
        </header>
      ) : (
        ""
      )}
      <div className=" w-full">{children}</div>
    </React.Fragment>
  );
}

export default MainLayout;
