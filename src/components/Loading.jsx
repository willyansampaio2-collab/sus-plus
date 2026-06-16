export default function Loading({ text = "Carregando...", fullScreen = false }) {
  return (
    <div className={fullScreen ? "loading loading--fullscreen" : "loading"}>
      <span className="loading__spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
