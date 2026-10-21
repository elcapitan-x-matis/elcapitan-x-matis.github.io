(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(Math.floor((w * h) / 9000), 180);
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        speed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const time = Date.now() * 0.001;
    stars.forEach(function (s) {
      const flicker = Math.sin(time * s.speed * 10 + s.phase) * 0.5 + 0.5;
      const alpha = s.baseAlpha * (0.5 + flicker * 0.5);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 210, 255, ' + alpha.toFixed(3) + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();