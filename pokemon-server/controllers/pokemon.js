const Pokemon = require("../models/pokemon");

module.exports = {
  async Create(req, res) {
    try {
      const { name } = req.body;

      const row = await Pokemon.create({ name, elements: null });

      res.status(201).json({
        success: true,
        message: "You Got a Pokemon",
        data: {
          id: row._id,
          name: row.name,
          elements: row.elements,
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
      let elements = rows.elements;
      elements += 1;

      let nextFibo = null;

      const fibonacciSeries = function (n) {
        /* Return single element array straight away */
        if (n === 0) {
          return [0];
        }

        let arr = [0, 1];

        /* If the number of name to generate is greater than 2, use a
         *  for-loop to iteratively add name into the result array
         * */
        for (let i = 2; i < n + 1; i++) {
          arr.push(arr[i - 2] + arr[i - 1]);
        }

        return arr;
      };
      if (1 <= elements && elements <= 100) {
        let fibonacci = fibonacciSeries(elements - 1);

        /* Sort the  sequence generated, in the following manner:
         *  Even numbers first, in descending order,
         *  Followed by Odd numbers, in descending order
         * */
        const sorted = [...fibonacci].sort(
          (a, b) => (a % 2) - (b % 2) || b - a
        );

        nextFibo = fibonacci[fibonacci.length - 1];
      }

      const row = await Pokemon.findByIdAndUpdate(
        { _id: req.params.id },
        { name: `${req.body.name}-${nextFibo}`, elements },
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
