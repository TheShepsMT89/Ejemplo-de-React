// Barra.jsx

import React, { useState } from "react";
import PropTypes from "prop-types";

const Barra = ({ mes, cantidad, estilo }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className={`${estilo} w-full mr-1 rounded hover:scale-110 cursor-pointer flex justify-center items-center`}
      style={{ height: `${cantidad}%` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && <h1 className="flex justify-center items-center  w-20 h-20 rounded  text-black">{mes}</h1>}
    </div>
  );
};

Barra.propTypes = {
  mes: PropTypes.string.isRequired,
  cantidad: PropTypes.string.isRequired,
  estilo: PropTypes.string,
};

// Asegúrate de exportar Barra como default
export default Barra;
