/**
 * Iconos animados — interacciones al toque
 * Enlazá este archivo después del HTML de los iconos.
 *
 * data-icon="fire"  → llama azul + crece
 * data-icon="coin" | data-icon="xp" → gira 1 vez
 * data-icon="trophy" → confeti desde la copa
 */

(function () {
  const CONFETTI_COLORS = [
    "#FFCE29",
    "#FF6B6B",
    "#4ECDC4",
    "#9C34C2",
    "#FFA500",
    "#3B82F6",
    "#FFFDF8",
  ];

  function triggerFire(btn) {
    btn.classList.remove("is-active");
    // Forzar reflow para reiniciar la animación si se toca seguido
    void btn.offsetWidth;
    btn.classList.add("is-active");
    window.setTimeout(() => btn.classList.remove("is-active"), 850);
  }

  function triggerCoinSpin(btn) {
    btn.classList.remove("is-spinning");
    void btn.offsetWidth;
    btn.classList.add("is-spinning");
    window.setTimeout(() => btn.classList.remove("is-spinning"), 650);
  }

  function spawnConfetti(btn) {
    const host = btn.querySelector(".trophy-confetti");
    if (!host) return;

    host.innerHTML = "";
    const count = 14;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];

      const angle = (Math.PI * (0.15 + Math.random() * 0.7)); // hacia arriba/afuera
      const dist = 28 + Math.random() * 42;
      const dx = Math.cos(angle) * dist * (Math.random() > 0.5 ? 1 : -1);
      const dy = -Math.abs(Math.sin(angle) * dist) - 10 - Math.random() * 20;
      const rot = (Math.random() * 520 - 260) + "deg";

      piece.style.setProperty("--dx", dx + "px");
      piece.style.setProperty("--dy", dy + "px");
      piece.style.setProperty("--rot", rot);
      piece.style.animationDelay = (Math.random() * 0.12) + "s";
      piece.style.width = (4 + Math.random() * 3) + "px";
      piece.style.height = (6 + Math.random() * 5) + "px";

      host.appendChild(piece);
    }

    window.setTimeout(() => {
      host.innerHTML = "";
    }, 1100);
  }

  function onIconActivate(btn) {
    const type = btn.getAttribute("data-icon");

    switch (type) {
      case "fire":
        triggerFire(btn);
        break;
      case "coin":
      case "xp":
        triggerCoinSpin(btn);
        break;
      case "trophy":
        spawnConfetti(btn);
        break;
      default:
        break;
    }
  }

  function init() {
    const icons = document.querySelectorAll(".app-icon[data-icon]");

    icons.forEach((btn) => {
      btn.addEventListener("click", () => onIconActivate(btn));

      // Teclado accesible
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onIconActivate(btn);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
