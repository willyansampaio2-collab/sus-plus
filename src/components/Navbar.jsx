export default function Navbar({ usuario, onLogout }) {

  return (

    <header
      style={{
        background: "#1351b4",
        color: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >

      <div>

        <h2>SUS+</h2>

        <small>
          {usuario}
        </small>

      </div>

      <button
        onClick={onLogout}
        style={{
          padding: "10px 15px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Sair
      </button>

    </header>

  );

}