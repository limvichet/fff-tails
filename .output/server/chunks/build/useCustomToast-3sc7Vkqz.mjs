const useCustomToast = () => {
  const showToast = (title, description, type = "success") => {
    const config = {
      success: {
        icon: "✅",
        bg: "#74EBBD"
        // Emerald Green
      },
      warning: {
        icon: "⚠️",
        bg: "#D5A24A"
        // Your Gold color
      },
      error: {
        icon: "❌",
        bg: "#EF4444"
        // Red
      }
    };
    const current = config[type];
    let container = (void 0).getElementById("custom-toast-container");
    if (!container) {
      container = (void 0).createElement("div");
      container.id = "custom-toast-container";
      (void 0).body.appendChild(container);
    }
    const toast = (void 0).createElement("div");
    toast.className = "my-custom-toast";
    toast.style.backgroundColor = current.bg;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">${current.icon}</div>
        <div class="toast-text">
          <div class="toast-title">${title}</div>
          <div class="toast-description">${description}</div>
        </div>
        <button class="toast-close">&times;</button>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add("is-visible"), 10);
    const remove = () => {
      toast.classList.remove("is-visible");
      toast.addEventListener("transitionend", () => toast.remove());
    };
    setTimeout(remove, 5e3);
    toast.querySelector(".toast-close")?.addEventListener("click", remove);
  };
  return { showToast };
};

export { useCustomToast as u };
//# sourceMappingURL=useCustomToast-3sc7Vkqz.mjs.map
