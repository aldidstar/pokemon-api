const Pokemon = require("../models/pokemon");
const axios = require("axios");

module.exports = {
  async Create(req, res) {
    try {
      const { name } = req.body;

      const row = await Pokemon.create({ name });

      res.status(201).json({
        success: true,
        message: "You Got a Pokemon",
        data: {
          id: row._id,
          name: row.name,
          species: {
            url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
            pokemonName: "ditto",
          },
          types: [
            {
              type: {
                name: "normal",
              },
            },
            {
              type: {
                name: "poison",
              },
            },
          ],
        },
      });
    } catch (error) {
      res.status(400).json({
        succes: false,
        message: error.message,
      });
    }
  },

  async GetAll(req, res) {
    try {
      const data = await Pokemon.find();
      const result = data.map((item) => {
        return {
          id: item._id,
          name: item.name,
          species: {
            url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
            pokemonName: "ditto",
          },
          types: [
            {
              type: {
                name: "normal",
              },
            },
            {
              type: {
                name: "poison",
              },
            },
          ],
        };
      });

      res.status(200).json({
        success: true,
        message: "All pokemon that you have",
        result,
      });
    } catch (error) {
      res.status(400).json({
        succes: false,
        message: error.message,
      });
    }
  },

  async GetOne(req, res) {
    let { id } = req.params;
    try {
      const row = await Pokemon.findById({ _id: req.params.id });

      if (!row) throw new Error(`Pokemon ID: ${id} not found`);

      res.status(200).json({
        success: true,
        message: `Retrieved Pokemons ID: ${id} data`,
        row,
      });
    } catch (error) {
      res.status(400).json({
        succes: false,
        message: error.message,
      });
    }
  },

  async UpdateOne(req, res) {
    let { id } = req.params;
    try {
      const rows = await Pokemon.findById({ _id: req.params.id });
      function fibo(n) {
        let fibList = [];
        if (n < 2) {
          fibList.push(0);
        } else {
          let prev = 0;
          let curr = 1;
          fibList.push(prev, curr);
          for (let i = 2; i < n; i++) {
            const next = prev + curr;
            prev = curr;
            curr = next;
            fibList.push(curr);
          }
        }
        return fibList;
      }
      const fibolist = fibo(12);

      const inputFibo = [];
      let changeFibo = 0;
      let nextFibo = [];

      if (
        rows.name.substring(rows.name.length - 2, rows.name.length - 1) == "-"
      ) {
        inputFibo.push(
          fibolist.indexOf(
            parseInt(
              rows.name.substring(rows.name.length - 1, rows.name.length)
            )
          ) + 1
        );
        nextFibo = fibo(parseInt(inputFibo) + 1);
        if (nextFibo.length === 3) {
          nextFibo = fibo(parseInt(inputFibo) + 2);
        }
        changeFibo = nextFibo[nextFibo.length - 1];
      } else {
        changeFibo = 0;
      }

      const row = await Pokemon.findByIdAndUpdate(
        { _id: req.params.id },
        { name: `${req.body.name}-${changeFibo}` },
        {
          new: true,
        }
      );

      if (!row) throw new Error(`Pokemon ID: ${id} not found`);

      res.status(201).json({
        success: true,
        message: `Item have been updated`,
        row,
      });
    } catch (error) {
      res.status(400).json({
        succes: false,
        message: error.message,
      });
    }
  },

  async Delete(req, res) {
    try {
      const primeNumber = (num) => {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++)
          if (num % i === 0) return false;
        return num > 1;
      };
      const randomNumber = Math.floor(Math.random() * 10);
      const checkPrime = primeNumber(randomNumber);
      if (checkPrime === false) {
        res.status(406).json({
          succes: false,
          message: `Number ${randomNumber} is not Prime Number`,
        });
      } else {
        const avail = await Pokemon.findOne({ _id: req.params.id });
        if (!avail) throw new Error(`Pokemon ID: ${req.params.id} not found`);

        const row = await Pokemon.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({
          success: true,
          message: `Pokemons ID: ${row.id} deleted`,
          row,
        });
      }
    } catch (error) {
      res.status(400).json({
        succes: false,
        message: error.message,
      });
    }
  },
};
