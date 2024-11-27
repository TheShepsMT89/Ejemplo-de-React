import React from "react";
import propTypes from "prop-types";

const Cuadro = ({ cantidad, titulo, estilo }) => {
  return (
    <div className="text-white">
      <div className="p-1">

        <div className="text-center mb-2">
          <h2 className="uppercase text-slate-400 font-semibold">{titulo}</h2>
        </div>

        <div className={`${estilo} flex justify-center rounded items-center h-24 cursor-pointer duration-500 `}>
          <p className="text-2xl">{cantidad}</p>
        </div>

      </div>
    </div>
  );
};

Cuadro.propTypes = {
  cantidad: propTypes.string.isRequired,  
  titulo: propTypes.string.isRequired,
  estilo: propTypes.string,  // Se mantiene como opcional
};

export default Cuadro;
