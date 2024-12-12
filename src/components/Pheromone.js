export const updatePheromones = (pheromones) => {
    pheromones.forEach((pheromone, index) => {
      pheromone.intensity -= 0.01;
      if (pheromone.intensity <= 0) pheromones.splice(index, 1);
    });
  };
  
  export const drawPheromones = (ctx, pheromones) => {
    pheromones.forEach((pheromone) => {
      ctx.fillStyle = `rgba(0, 0, 255, ${pheromone.intensity})`;
      ctx.beginPath();
      ctx.arc(pheromone.x, pheromone.y, pheromone.intensity * 3, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    });
  };
  