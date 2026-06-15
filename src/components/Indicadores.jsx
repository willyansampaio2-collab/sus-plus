import Card from "./Card";

export default function Indicadores() {

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px",
        marginTop: "30px"
      }}
    >

      <Card
        titulo="Consultas"
        descricao="Gerencie seus agendamentos."
      />

      <Card
        titulo="Fila de Espera"
        descricao="Consulte sua posição."
      />

      <Card
        titulo="Indicadores"
        descricao="Estatísticas do sistema."
      />

    </div>

  );

}