import React, { useState, useEffect } from "react";
import { Spacer } from "../../components";
import {
  Header,
  PokemonInfo,
  PokemonMoves,
  PokemonBaseStats,
} from "../../templates";
import { toUpperCase } from "../../utils/upperCase";
import { useLocation } from "react-router";
import { Color } from "../../utils/Color";

const PokemonDetail = () => {
  // const [setIsLoading] = useState(true);
  const [catchingPokemon, setCatchingPokemon] = useState(null);
  const { state } = useLocation();
  const { image, data, name, typeColor, bgCardColor } = state;
  const [myPokemonList, setMyPokemonList] = useState(null);
  const getData = async () => {
    const url = "http://localhost:3000/api/mypokemon";
    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(([res, data]) => {
        if (res === 200) {
          setMyPokemonList(data.result);
        } else {
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const postData = async (name) => {
    const url = "http://localhost:3000/api/mypokemon";

    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    })
      .then((response) => response.status)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const catchPokemon = async (e) => {
    e.preventDefault();
    setCatchingPokemon(Math.random() < 0.5);

    if (catchingPokemon === true) {
      let names = myPokemonList?.map((a) => a.name);

      let pokemonName = prompt("You got a pokemon, give him a name!");
      let otherPokemonName = prompt("Please give another name");
      let nickname = "";
      if (names.indexOf(pokemonName) === -1) {
        if (pokemonName === null || pokemonName === "") nickname = "Pikatchu";
        await postData(nickname);
        getData();
      } else if (names.indexOf(pokemonName) !== -1) {
        if (names.indexOf(otherPokemonName) !== -1) {
          alert("Try Again", {
            title: "Fokemon run away!",
          });
        } else if (otherPokemonName === null || otherPokemonName === "") {
          nickname = "Pikatchu";
          await postData(nickname);
          getData();
        } else {
          nickname = otherPokemonName;
          await postData(nickname);
          getData();
        }
        prompt("Please give another name");
      } else {
        nickname = pokemonName;
        await postData(nickname);
        getData();
      }
    } else {
      alert("Try Again", {
        title: "Fokemon run away!",
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [menu, setMenu] = useState({
    info: true,
    move: false,
    baseStats: false,
  });

  return (
    <div
      style={{
        backgroundColor: Color.lightGrey2,
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: "100vh",
      }}
    >
      <div style={{ backgroundColor: bgCardColor }}>
        <Header
          catchPokemon={(e) => catchPokemon(e)}
          hasBack={true}
          title={"Detail"}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            padding: "20px 20px 0 20px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <div>
              <img src={image} alt={name} width="150" height="150" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontWeight: 300 }}>{`#${data?.pokemon?.id}`}</h2>
              <Spacer />
              <h3>{toUpperCase(name)}</h3>
              <Spacer size={5} />
              <div style={{ flexDirection: "row", display: "flex" }}>
                {data?.pokemon?.types?.map((type, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: typeColor,
                      borderRadius: 5,
                      padding: "3px 5px",
                      margin: "0 7px 0 0",
                    }}
                  >
                    <p style={{ fontSize: "12px" }}>
                      {toUpperCase(type?.type?.name)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Spacer size={30} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                cursor: "pointer",
                padding: "3px 15px",
                borderBottom: menu.info && `2px solid ${typeColor}`,
              }}
              onClick={() =>
                setMenu({
                  info: true,
                  move: false,
                  baseStats: false,
                })
              }
            >
              <h5
                style={{
                  fontSize: 18,
                  color: menu.info ? typeColor : Color.black,
                }}
              >
                Info
              </h5>
            </div>
            <div
              style={{
                cursor: "pointer",
                padding: "3px 15px",
                borderBottom: menu.move && `2px solid ${typeColor}`,
              }}
              onClick={() =>
                setMenu({
                  info: false,
                  move: true,
                  baseStats: false,
                })
              }
            >
              <h5
                style={{
                  fontSize: 18,
                  color: menu.move ? typeColor : Color.black,
                }}
              >
                Move
              </h5>
            </div>
            <div
              style={{
                cursor: "pointer",
                padding: "3px 15px",
                borderBottom: menu.baseStats && `2px solid ${typeColor}`,
              }}
              onClick={() =>
                setMenu({
                  info: false,
                  move: false,
                  baseStats: true,
                })
              }
            >
              <h5
                style={{
                  fontSize: 18,
                  color: menu.baseStats ? typeColor : Color.black,
                }}
              >
                Base State
              </h5>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: Color.lightGrey2,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            minHeight: 200,
            padding: 20,
          }}
        >
          {menu.info && <PokemonInfo pokemon={data?.pokemon} />}
          {menu.move && (
            <PokemonMoves moves={data?.pokemon?.moves} color={typeColor} />
          )}
          {menu.baseStats && (
            <PokemonBaseStats stats={data?.pokemon?.stats} color={typeColor} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
