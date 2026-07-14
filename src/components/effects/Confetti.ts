import confetti from "canvas-confetti";

export function celebrate() {
  const colors = ["#cba6f7", "#89b4fa", "#74c7ec", "#a6e3a1", "#f9e2af", "#f38ba8"];
  confetti({
    particleCount: 120,
    spread: 75,
    origin: { y: 0.7 },
    colors,
    disableForReducedMotion: true,
  });
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0 }, colors });
    confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1 }, colors });
  }, 220);
}

export function smallBurst() {
  confetti({
    particleCount: 40,
    spread: 55,
    startVelocity: 28,
    origin: { y: 0.85 },
    disableForReducedMotion: true,
    colors: ["#cba6f7", "#89b4fa", "#a6e3a1"],
  });
}
