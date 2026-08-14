function FlashMessage({ type, message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`flash-message ${
        type === "success"
          ? "flash-success"
          : "flash-error"
      }`}
    >
      {message}
    </div>
  );
}

export default FlashMessage;