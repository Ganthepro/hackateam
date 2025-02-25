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

function CreateConfirm(word, onConfirm, onCancel) {
  const block = document.createElement("div");
  const text = document.createElement("p");
  text.textContent = word;

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "✓";
  confirmButton.style.background = "white";
  confirmButton.style.color = "black";
  confirmButton.style.border = "none";
  confirmButton.style.padding = "5px 10px";
  confirmButton.style.cursor = "pointer";
  confirmButton.style.borderRadius = "5px";
  confirmButton.onclick = () => {
    if (onConfirm) onConfirm();
    block.remove();
  };

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "✖";
  cancelButton.style.background = "white";
  cancelButton.style.color = "black";
  cancelButton.style.border = "none";
  cancelButton.style.padding = "5px 10px";
  cancelButton.style.cursor = "pointer";
  cancelButton.style.borderRadius = "5px";
  cancelButton.onclick = () => {
    if (onCancel) onCancel();
    block.remove();
  };

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
    minWidth: "250px",
    justifyContent: "space-between",
  };

  Object.assign(block.style, blockStyle);

  block.append(text, confirmButton, cancelButton);
  document.body.append(block);
}
