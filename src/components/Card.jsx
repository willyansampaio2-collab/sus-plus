export default function Card({
  titulo,
  descricao
}) {

  return (

    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,.1)"
      }}
    >

      <h3>{titulo}</h3>

      <p>{descricao}</p>

    </div>

  );

}