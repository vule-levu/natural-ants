export const initializeFoods = (count, width, height) => {
    const foods = [];
    for (let i = 0; i < count; i++) {
      foods.push({ x: Math.random() * width, y: Math.random() * height, capacity: 10 });
    }
    return foods;
  };
  
  export const drawFoods = (ctx, foods) => {
    foods.forEach((food) => {
      ctx.fillStyle = food.capacity > 0 ? 'red' : 'gray';
      ctx.beginPath();
      ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    });
  };
  