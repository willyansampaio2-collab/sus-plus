import { useState, useEffect } from "react";
import { logout } from "../services/authService";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Indicadores from "../components/Indicadores";

export default function Dashboard() {

  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [especialidade, setEspecialidade] =
    useState("Cardiologia");

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [consultas, setConsultas] =
    useState([]);

  useEffect(() => {

    const dados =
      localStorage.getItem("consultas");

    if (dados) {
      setConsultas(
        JSON.parse(dados)
      );
    }

  }, []);

  async function sair() {

    await logout();

    navigate("/");

  }

  async function buscarCEP() {

    try {

      const resposta =
        await fetch(
          `https://viacep.com.br/ws/${cep}/json/`
        );

      const dados =
        await resposta.json();

      setRua(
        dados.logradouro || ""
      );

      setBairro(
        dados.bairro || ""
      );

      setCidade(
        dados.localidade || ""
      );

      setEstado(
        dados.uf || ""
      );

    } catch {

      alert(
        "Erro ao buscar CEP"
      );

    }

  }

  function agendar(e) {

    e.preventDefault();

    const novaConsulta = {

      nome,
      cpf,
      especialidade,

      cep,
      rua,
      bairro,
      cidade,
      estado,

      data:
        new Date()
          .toLocaleDateString()

    };

    const listaAtualizada = [

      ...consultas,
      novaConsulta

    ];

    setConsultas(
      listaAtualizada
    );

    localStorage.setItem(
      "consultas",
      JSON.stringify(
        listaAtualizada
      )
    );

    alert(
      "Consulta cadastrada!"
    );

    setNome("");
    setCpf("");
    setCep("");
    setRua("");
    setBairro("");
    setCidade("");
    setEstado("");

  }

  return (

    <div
      style={{
        display: "flex"
      }}
    >

      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "30px"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center"
          }}
        >

          <h1>
            Painel SUS+
          </h1>

          <button
            onClick={sair}
          >
            Sair
          </button>

        </div>

        <p>

          Usuário:

          {" "}

          <strong>
            {
              auth.currentUser
                ?.email
            }
          </strong>

        </p>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,.1)"
          }}
        >

          <h2>
            Agendar Consulta
          </h2>

          <form
            onSubmit={agendar}
          >

            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px"
              }}
            />

            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) =>
                setCpf(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px"
              }}
            />

            <select
              value={
                especialidade
              }
              onChange={(e) =>
                setEspecialidade(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px"
              }}
            >
              <option>
                Cardiologia
              </option>
              <option>
                Neurologia
              </option>
              <option>
                Ortopedia
              </option>
              <option>
                Endocrinologia
              </option>
              <option>
                Pediatria
              </option>
            </select>

            <input
              type="text"
              placeholder="CEP"
              value={cep}
              onChange={(e) =>
                setCep(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px"
              }}
            />

            <button
              type="button"
              onClick={
                buscarCEP
              }
              style={{
                marginTop: "10px"
              }}
            >
              Buscar CEP
            </button>

            <input
              value={rua}
              readOnly
              placeholder="Rua"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px"
              }}
            />

            <input
              value={bairro}
              readOnly
              placeholder="Bairro"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px"
              }}
            />

            <input
              value={cidade}
              readOnly
              placeholder="Cidade"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px"
              }}
            />

            <input
              value={estado}
              readOnly
              placeholder="Estado"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px"
              }}
            />

            <button
              type="submit"
              style={{
                marginTop: "15px"
              }}
            >
              Agendar
            </button>

          </form>

        </div>

        <Indicadores />

      </main>

    </div>

  );

}