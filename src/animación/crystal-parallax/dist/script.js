"use strict";

const canvas = document.getElementById("canvas");
if (!canvas) {
  console.warn("Canvas element not found");
}

const ctx = canvas ? canvas.getContext("2d") : null;
const bgg = document.getElementById("bg_glow");

let w = 0;
let h = 0;
let maxHeight = 0;
let minHeight = 0;

if (ctx) {
  w = ctx.canvas.width = window.innerWidth;
  h = ctx.canvas.height = window.innerHeight;
  maxHeight = h * 0.9;
  minHeight = h * 0.5;
}

const md = 100;
const maxWidth = 15;
const minWidth = 2;
const maxSpeed = 35;
const minSpeed = 6;
let hue = 42;
const hueDif = 8;
const glow = 12;

let dots = [];

function pushDots() {
  for (let i = 1; i < md; i++) {
    dots.push({
      x: Math.random() * w,
      y: (Math.random() * h) / 2,
      h: Math.random() * (maxHeight - minHeight) + minHeight,
      w: Math.random() * (maxWidth - minWidth) + minWidth,
      c: Math.random() * (hue + hueDif - (hue - hueDif)) + (hue - hueDif),
      m: Math.random() * (maxSpeed - minSpeed) + minSpeed,
    });
  }
}

if (ctx) {
  ctx.globalCompositeOperation = "lighter";
  pushDots();
}

window.addEventListener("resize", () => {
  if (!ctx) return;
  w = ctx.canvas.width = window.innerWidth;
  h = ctx.canvas.height = window.innerHeight;
  maxHeight = h * 0.9;
  minHeight = h * 0.5;
  dots = [];
  pushDots();
  ctx.globalCompositeOperation = "lighter";
});

const overlay = document.getElementById("overlay");
if (overlay) {
  overlay.addEventListener("click", () => {
    hue = Math.random() * 360;
    if (bgg) {
      bgg.style.background = `radial-gradient(ellipse at center, hsla(${hue},50%,50%,.8) 0%,rgba(0,0,0,0) 100%)`;
    }
    dots = [];
    pushDots();
  });
}

function render() {
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    ctx.beginPath();
    const grd = ctx.createLinearGradient(dot.x, dot.y, dot.x + dot.w, dot.y + dot.h);
    grd.addColorStop(0.0, `hsla(${dot.c},75%,45%,0)`);
    grd.addColorStop(0.2, `hsla(${dot.c},78%,52%,.45)`);
    grd.addColorStop(0.5, `hsla(${dot.c + 3},88%,66%,.85)`);
    grd.addColorStop(0.8, `hsla(${dot.c},75%,50%,.45)`);
    grd.addColorStop(1.0, `hsla(${dot.c - 4},70%,42%,0)`);
    ctx.shadowBlur = glow;
    ctx.shadowColor = `hsla(${dot.c},85%,55%,.8)`;
    ctx.fillStyle = grd;
    ctx.fillRect(dot.x, dot.y, dot.w, dot.h);
    ctx.closePath();
    dot.x += dot.m / 100;
    if (dot.x > w + maxWidth) {
      dot.x = -maxWidth;
    }
  }
  window.requestAnimationFrame(render);
}

if (bgg) {
  bgg.style.background = `radial-gradient(ellipse at center, hsla(${hue},50%,50%,.8) 0%,rgba(0,0,0,0) 100%)`;
}
if (ctx) {
  render();
}