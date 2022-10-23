import React from "react";
import { Route, Routes } from "react-router-dom";
import * as pages from "../pages";

const RouterPage = () => {
  return (
    <Routes>
      <Route path="/" element={<pages.PokemonList />} exact />
      <Route path="/mypokemon" element={<pages.MyPokemonList />} exact />
      <Route path="/detail/:id-:name" element={<pages.PokemonDetail />} exact />
    </Routes>
  );
};

export default RouterPage;
