import React from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import Perfil from "../components/perfil";
const Navigation = ({ items, perfil }) => {
  return (
    <nav className="w-40 h-screen flex flex-col justify-between bg-[#0f0f0f] border-r-[1px]  border-opacity-25 border-white">
      <ul className="flex flex-col items-start space-y-2 p-4 ">
        {items.map((item, index) => (
          <li
            key={index}
            className="transition-colors text-slate-400  hover:text-white font-medium cursor-pointer"
          >
            <Link to={item.path} className="block px-4 py-2">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      {/* {Perfil ? Perfil : ""} */}
      <Perfil/>
    </nav>
  );
};


Navigation.propTypes = {
  items: propTypes.arrayOf(
    propTypes.shape({
      name: propTypes.string.isRequired,
      path: propTypes.string.isRequired,
    })
  ).isRequired,
};

export default Navigation;
