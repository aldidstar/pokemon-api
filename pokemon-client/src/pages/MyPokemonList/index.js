import React, { useState, useEffect } from "react";
import { Header, MyPokemonCard } from "../../templates";
import Swal from "sweetalert2";
import Lottie from "react-lottie";
import pikacu from "../../assets/animations/pikachu.json";
import { Color } from "../../utils/Color";
import { child } from "../../assets";
import { Spacer } from "../../components";
import { Col } from "reactstrap";

const MyPokemonList = () => {
  const [loading, setIsLoading] = useState(true);
  const [myPokemonList, setMyPokemonList] = useState(null);
  const [catchingPokemon, setCatchingPokemon] = useState(null);
  const [RenamingPokemon, setRenamingPokemon] = useState(true);

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
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        setIsLoading(false);
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
      .then((response) => {
        return response.status;
      })
      .then((res) => {
        if (res === 200) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        setIsLoading(false);
      });
  };

  const catchPokemon = async (e) => {
    e.preventDefault();
    setRenamingPokemon(Math.random() < 0.5);

    if (catchingPokemon === true) {
      let names = myPokemonList?.map((a) => a.name);
      let pokemonName = prompt("You got a pokemon, give him a name!");

      let nickname = "";
      if (pokemonName === null || pokemonName === "") {
        let nulPokemonName = prompt("Please give a name");
        if (nulPokemonName === null || nulPokemonName === "") {
          alert("You got a pokemon with name default Pikatchu!");
          nickname = "Pikatchu";
          await postData(nickname);
          getData();
        } else if (names.indexOf(nulPokemonName) === -1) {
          nickname = nulPokemonName;
          await postData(nickname);
          getData();
        } else {
          alert("Already have with this name", {
            title: "Fokemon run away!",
          });
        }
      } else if (names.indexOf(pokemonName) === -1) {
        nickname = pokemonName;
        await postData(nickname);
        getData();
      } else {
        let otherPokemonName = prompt("Please give another name");
        if (otherPokemonName === null || otherPokemonName === "") {
          alert("You got a pokemon with name default Pikatchu!");
          nickname = "Pikatchu";
          await postData(nickname);
          getData();
        } else if (names.indexOf(otherPokemonName) === -1) {
          nickname = otherPokemonName;
          await postData(nickname);
          getData();
        } else {
          alert("Already have with this name", {
            title: "Fokemon run away!",
          });
        }
      }
    } else {
      alert("Try Again", {
        title: "Fokemon run away!",
      });
    }
  };

  const deleteData = async (id) => {
    const url = `http://localhost:3000/api/mypokemon/${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 406) {
          return alert("failed to delete");
        } else {
          return response.status;
        }
      })
      .then((res) => {
        if (res === 200) {
          setIsLoading(false);
          getData();
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        setIsLoading(false);
      });
  };

  const renameData = async (id, name) => {
    const url = `http://localhost:3000/api/mypokemon/${id}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    })
      .then((response) => {
        if (response.status === 406) {
          return alert("failed to delete");
        } else {
          return response.status;
        }
      })
      .then((res) => {
        if (res === 200) {
          setIsLoading(false);
          getData();
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        setIsLoading(false);
      });
  };

  const deletePokemon = async (id, e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData(id);
      }
    });
  };

  const renamePokemon = async (id, name, e) => {
    e.preventDefault();
    setCatchingPokemon(true);
    console.log(RenamingPokemon);

    if (RenamingPokemon === true) {
      let pokemonName = prompt(`rename ${name}`);
      if (pokemonName === null || pokemonName === "") {
        await renameData(id, name);
        getData();
      } else {
        await renameData(id, pokemonName);
        getData();
        Swal.fire("Updated!", "Your Pokemon has been updated.", "success");
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: pikacu,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      style={{
        backgroundColor: "#FAE159",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Header
        title={"My Pokemon"}
        hasBack={"/"}
        catchPokemon={(e) => catchPokemon(e)}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={child} width="100" height="100" alt="child" />
        <Spacer />
        {myPokemonList?.length && <p>My Pokemon ({myPokemonList?.length})</p>}
      </div>
      <Spacer />
      <div
        style={{
          padding: "20px 15px",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: "65vh",
          backgroundColor: Color.lightGrey,
        }}
      >
        {!loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {myPokemonList.length > 1 ? (
              myPokemonList?.map((pokemon, idx) => (
                <Col sm="3" lg="5" md="4" key={idx}>
                  <MyPokemonCard
                    width={"31%"}
                    data={pokemon}
                    deletePokemon={(e) => deletePokemon(pokemon.id, e)}
                    renamePokemon={(e) =>
                      renamePokemon(pokemon.id, pokemon.name, e)
                    }
                  />
                </Col>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p>Kamu belum punya pokemon, yuk cari</p>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              minHeight: "78vh",
            }}
          >
            <Lottie options={defaultOptions} height={250} width={250} />
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPokemonList;
