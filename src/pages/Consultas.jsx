import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Consultas() {

  const [consultas, setConsultas] = useState([]);

  useEffect(() => {

    const dados =
      localStorage.getItem("consultas");

    if (dados) {
      setConsultas(
        JSON.parse(dados)
      );
    }

  }, []);

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

        <h1>Minhas Consultas</h1>

        {consultas.length === 0 ? (

          <p>
            Nenhuma consulta cadastrada.
          </p>

        ) : (

          consultas.map(
            (consulta, index) => (

              <div
                key={index}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  marginTop: "15px",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,.1)"
                }}
              >

                <h3>
                  {consulta.nome}
                </h3>

                <p>
                  CPF:
                  {" "}
                  {consulta.cpf}
                </p>

                <p>
                  Especialidade:
                  {" "}
                  {consulta.especialidade}
                </p>

                <p>
                  Endereço:
                  {" "}
                  {consulta.rua}
                </p>

                <p>
                  {consulta.bairro}
                  {" - "}
                  {consulta.cidade}
                  /
                  {consulta.estado}
                </p>

                <p>
                  Data:
                  {" "}
                  {consulta.data}
                </p>

              </div>

            )
          )

        )}

      </main>

    </div>
  );
}