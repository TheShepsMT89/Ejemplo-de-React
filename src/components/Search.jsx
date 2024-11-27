import React, { useState } from "react";

const Search = ({ elements, setFilteredFacturas }) => {
  const [search, setSearch] = useState({
    cliente: "",
    fecha: "",
    estado: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newSearch = { ...search, [name]: value };
    setSearch(newSearch);

    // Filtrar elementos
    const filtered = elements.filter((element) => {
      // Filtrar por cliente
      const clienteMatch = element.cliente_nombre
        .toLowerCase()
        .includes(newSearch.cliente.toLowerCase()); 

      // Filtrar por fecha
      const fechaMatch = newSearch.fecha
        ? element.fecha.includes(newSearch.fecha) 
        : true;

      // Filtrar por estado
      const estadoMatch = newSearch.estado
        ? element.estado.toLowerCase().includes(newSearch.estado.toLowerCase())
        : true;

      // Verificar que coincidan todos los filtros aplicados
      return clienteMatch && fechaMatch && estadoMatch;
    });

    setFilteredFacturas(filtered); // Aquí se actualiza el estado con las facturas filtradas
  };

  return (
    <div className="flex space-x-4 w-full">
      <input
        type="text"
        name="cliente"
        value={search.cliente}
        onChange={handleChange}
        placeholder="Buscar por cliente"
        className="p-2 w-1/2 bg-tertiary text-white rounded-sm border-white border-[1px] border-opacity-15 focus:border-opacity-50"
      />
      <input
        type="date"
        name="fecha"
        value={search.fecha}
        onChange={handleChange}
        placeholder="Buscar por fecha"
        className="p-2 bg-tertiary text-white rounded-sm border-white border-[1px] border-opacity-15 focus:border-opacity-50"
      />
      <select
        name="estado"
        value={search.estado}
        onChange={handleChange}
        className="p-2 bg-tertiary text-white rounded-sm border-white border-[1px] border-opacity-15 focus:border-opacity-50"
      >
        <option value="">Todos los estados</option>
        <option value="pagada">Pagada</option>
        <option value="pendiente">Pendiente</option>
      </select>
    </div>
  );
};

export default Search;
