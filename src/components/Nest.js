export const drawNest = (ctx, nest) => {
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.beginPath();
    ctx.arc(nest.x, nest.y, nest.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };
  