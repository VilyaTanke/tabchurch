// Licence CC BY-NC-SA 4.0
// Attribution — You must give appropriate credit.
// Non Commercial — You may not use the material for commercial purposes.

import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js'

const app = LiquidBackground(document.getElementById('canvas'))

app.loadImage('./liquid-gold.jpg')
app.liquidPlane.material.metalness = 0.82
app.liquidPlane.material.roughness = 0.22
app.liquidPlane.uniforms.displacementScale.value = 5.0
app.setRain(true)
app.setRainTime(0.35)