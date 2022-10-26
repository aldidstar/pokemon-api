const express = require("express");

const PokemonCtrl = require("../controllers/pokemon");

const router = express.Router();

router.post("/myPokemon", PokemonCtrl.Create);
router.delete("/myPokemon/:id", PokemonCtrl.Delete);
router.get("/myPokemon/:id", PokemonCtrl.GetOne);
router.put("/myPokemon/:id", PokemonCtrl.UpdateOne);
router.get("/myPokemon", PokemonCtrl.GetAll);

module.exports = router;
