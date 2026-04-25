'use client';

import { useEffect, useRef } from 'react';

interface Streak {
  x: number;
  y: number;
  speed: number;
  length: number;
  width: number;
  color: string;
  alpha: number;
  lane: number;
  dir: 1 | -1; // 1 = toward, -1 = away
}

interface Particle {
  x: number;
  y: number;
  r: number;
  alpha: number;
  vx: number;
  vy: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    const streaks: Streak[] = [];
    const particles: Particle[] = [];

    // ── Road geometry ──────────────────────────────
    // Perspective vanishing point
    const VP = { x: 0.5, y: 0.42 }; // fraction of canvas

    function vpX() { return W * VP.x; }
    function vpY() { return H * VP.y; }

    // Road edges at bottom of canvas
    const ROAD_LEFT_FRAC = 0.05;
    const ROAD_RIGHT_FRAC = 0.95;

    // Number of lanes each direction
    const LANES = 3;

    function laneX(lane: number, progress: number) {
      // lane 0..LANES-1, progress 0=vanish 1=bottom
      const halfW = W * 0.5;
      const roadHalf = (ROAD_RIGHT_FRAC - ROAD_LEFT_FRAC) * W * 0.5;
      const laneW = roadHalf / LANES;
      // offset from center
      const laneCenter = -roadHalf + laneW * (lane + 0.5);
      const x = vpX() + laneCenter * progress;
      return x;
    }

    function roadY(progress: number) {
      return vpY() + (H - vpY()) * progress;
    }

    // ── Spawn streak ─────────────────────────────
    function spawnStreak() {
      const dir = Math.random() < 0.5 ? 1 : -1 as 1 | -1;
      const totalLanes = LANES * 2;
      const lane = Math.floor(Math.random() * LANES);

      // Taillights = red (dir 1, going away = toward VP)
      // Headlights = white/blue (dir -1, coming toward camera)
      const isTail = dir === 1;
      const color = isTail
        ? `hsl(0,90%,${50 + Math.random() * 10}%)`
        : `hsl(${200 + Math.random() * 30},80%,${80 + Math.random() * 20}%)`;

      streaks.push({
        x: 0,
        y: Math.random() * 0.15 + 0.01, // start near vanish point
        speed: Math.random() * 0.012 + 0.008,
        length: Math.random() * 0.06 + 0.02,
        width: Math.random() * 1.5 + 0.5,
        color,
        alpha: Math.random() * 0.5 + 0.5,
        lane,
        dir,
      });
    }

    // ── Spawn particle ────────────────────────────
    function spawnParticle() {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.6,
        r: Math.random() * 80 + 20,
        alpha: Math.random() * 0.04 + 0.01,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.2 - 0.05,
      });
    }

    for (let i = 0; i < 20; i++) spawnStreak();
    for (let i = 0; i < 12; i++) spawnParticle();

    function resize() {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resize();
    window.addEventListener('resize', resize);

    // ── Draw road surface ──────────────────────────
    function drawRoad() {
      const vx = vpX(), vy = vpY();
      const bl = W * ROAD_LEFT_FRAC, br = W * ROAD_RIGHT_FRAC;

      // Road fill
      const roadGrad = ctx.createLinearGradient(0, vy, 0, H);
      roadGrad.addColorStop(0, 'rgba(20,18,14,0)');
      roadGrad.addColorStop(0.3, 'rgba(22,20,15,0.8)');
      roadGrad.addColorStop(1, 'rgba(15,14,10,1)');

      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(br, H);
      ctx.lineTo(bl, H);
      ctx.closePath();
      ctx.fillStyle = roadGrad;
      ctx.fill();

      // Center divider glow
      const divGrad = ctx.createLinearGradient(0, vy, 0, H);
      divGrad.addColorStop(0, 'rgba(255,220,50,0)');
      divGrad.addColorStop(0.5, 'rgba(255,200,30,0.25)');
      divGrad.addColorStop(1, 'rgba(255,180,20,0.08)');

      // Dashed lane markers
      ctx.save();
      for (let seg = 0; seg < 24; seg++) {
        const p0 = seg / 24;
        const p1 = (seg + 0.45) / 24;
        if (seg % 2 === 0) {
          for (let l = 1; l < LANES; l++) {
            const x0 = laneX(l - 1, p0) + (laneX(l, p0) - laneX(l - 1, p0)) / 2;
            const x1 = laneX(l - 1, p1) + (laneX(l, p1) - laneX(l - 1, p1)) / 2;
            const y0 = roadY(p0);
            const y1 = roadY(p1);
            const alpha = 0.15 + p0 * 0.2;
            const lw = Math.max(0.5, p0 * 2.5);
            ctx.strokeStyle = `rgba(255,220,80,${alpha})`;
            ctx.lineWidth = lw;
            // Right lanes
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
            // Left lanes (mirror)
            const mx0 = 2 * vpX() - x0;
            const mx1 = 2 * vpX() - x1;
            ctx.beginPath(); ctx.moveTo(mx0, y0); ctx.lineTo(mx1, y1); ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Center solid line
      ctx.save();
      const cGrad = ctx.createLinearGradient(0, vy, 0, H);
      cGrad.addColorStop(0, 'rgba(255,200,40,0)');
      cGrad.addColorStop(0.3, 'rgba(255,200,40,0.3)');
      cGrad.addColorStop(1, 'rgba(255,200,40,0.12)');
      ctx.strokeStyle = cGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx, H);
      ctx.stroke();
      ctx.restore();
    }

    // ── Draw single streak ─────────────────────────
    function drawStreak(s: Streak) {
      const dir = s.dir;
      // progress: 0 = vanish point, 1 = camera
      const p1 = s.y;
      const p0 = Math.max(0, s.y - s.length);

      // Lane position — right side = incoming, left = outgoing (or vice versa)
      const laneOffset = dir === -1 ? s.lane : LANES + s.lane;
      // map laneOffset (0..LANES*2) to actual lane geometry
      // right half = lanes LANES..LANES*2-1, left half = LANES-1..0
      const isRight = laneOffset >= LANES;
      const laneIdx = isRight ? laneOffset - LANES : LANES - 1 - (laneOffset - 0);

      const x1r = laneX(laneIdx, p1);
      const x0r = laneX(laneIdx, p0);
      const y1 = roadY(p1);
      const y0 = roadY(p0);

      const cx = isRight ? x1r : 2 * vpX() - x1r;
      const cx0 = isRight ? x0r : 2 * vpX() - x0r;

      // Width grows with progress
      const lineW = Math.max(0.3, s.width * p1 * 3);

      const grad = ctx.createLinearGradient(cx0, y0, cx, y1);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.6, s.color.replace('hsl', 'hsla').replace(')', `,${s.alpha * 0.8})`));
      grad.addColorStop(1, s.color.replace('hsl', 'hsla').replace(')', `,${s.alpha})`));

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = grad;
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.shadowColor = s.color;
      ctx.shadowBlur = lineW * 6;
      ctx.beginPath();
      ctx.moveTo(cx0, y0);
      ctx.lineTo(cx, y1);
      ctx.stroke();
      ctx.restore();
    }

    // ── Draw atmospheric glow ──────────────────────
    function drawGlow() {
      // Horizon glow
      const hg = ctx.createRadialGradient(vpX(), vpY(), 0, vpX(), vpY(), W * 0.6);
      hg.addColorStop(0, 'rgba(200,50,26,0.12)');
      hg.addColorStop(0.5, 'rgba(120,30,10,0.04)');
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, 0, W, H);

      // Road surface reflection glow
      const rg = ctx.createRadialGradient(vpX(), H, 0, vpX(), H, W * 0.4);
      rg.addColorStop(0, 'rgba(200,50,26,0.07)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Main loop ──────────────────────────────────
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#050404');
      sky.addColorStop(0.4, '#100a08');
      sky.addColorStop(0.7, '#190e09');
      sky.addColorStop(1, '#0a0806');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.save();
      for (let i = 0; i < 80; i++) {
        const sx = (((i * 137.5 + 13) % 1) * W + i * 23) % W;
        const sy = (((i * 97.3 + 7) % 1) * H * 0.45 + i * 5) % (H * 0.45);
        const a = 0.2 + (Math.sin(frame * 0.02 + i) * 0.5 + 0.5) * 0.4;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,220,${a})`;
        ctx.fill();
      }
      ctx.restore();

      // Particles (bokeh)
      for (const p of particles) {
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        pg.addColorStop(0, `rgba(220,80,40,${p.alpha})`);
        pg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pg;
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -p.r || p.x < -p.r || p.x > W + p.r) {
          p.x = Math.random() * W;
          p.y = H * 0.5 + Math.random() * H * 0.1;
        }
      }

      drawRoad();
      drawGlow();

      // Update & draw streaks
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.y += s.speed * (0.5 + s.y * 1.5); // accelerate as it approaches
        drawStreak(s);
        if (s.y > 1.05) {
          streaks.splice(i, 1);
        }
      }

      // Spawn new streaks
      if (frame % 8 === 0) spawnStreak();

      frame++;
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
