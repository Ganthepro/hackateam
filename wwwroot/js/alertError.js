function CreateErrorBlock(word) {
  const block = document.createElement("div");
  const text = document.createElement("p");
  text.textContent = word;

  const blockStyle = {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
    minWidth: "200px",
    justifyContent: "space-between",
  };

  Object.assign(block.style, blockStyle);

  block.append(text);
  document.body.append(block);

  setTimeout(() => {
    block.remove();
  }, 3000);
}
