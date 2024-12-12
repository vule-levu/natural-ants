export const createObstacle = (x, y, obstacles, nest) => {
    const size = Math.random() * 20 + 10;
    const overlaps = obstacles.some((obstacle) => {
      const dx = x - obstacle.x;
      const dy = y - obstacle.y;
      return Math.hypot(dx, dy) < obstacle.size + size + 5;
    });
    const overlapsNest = Math.hypot(x - nest.x, y - nest.y) < nest.radius + size;
  
    if (!overlaps && !overlapsNest) {
      obstacles.push({ x, y, size });
    }
  };
  
  export const drawObstacles = (ctx, obstacles) => {
    obstacles.forEach((obstacle) => {
      ctx.fillStyle = 'brown';
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y, obstacle.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    });
  };
  