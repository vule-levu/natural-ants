const DISTANCE_WEIGHT = 0.1; // Balances food capacity vs. distance

export const initializeAnts = (width, height, count, nest) => 
{
    const ants = [];
    for (let i = 0; i < count; i++)
    {
        ants.push(createAnt(width, height, nest));
    }
    return ants;
};

const createAnt = (width, height, nest) => {
  return {
    x: nest.x + (Math.random() - 0.5) * nest.radius,
    y: nest.y + (Math.random() - 0.5) * nest.radius,
    dx: Math.random() * 2 - 1,
    dy: Math.random() * 2 - 1,
    carryingFood: false,
    targetFood: null,

    update(foods, obstacles, pheromones, nest, newFoodAdded) {
      if (!this.carryingFood) {
        // Re-evaluate the target food if:
        // 1. A new food source has been added.
        // 2. The current target is depleted.
        if (newFoodAdded || !this.targetFood || this.targetFood.capacity <= 0) {
          this.chooseNearestFood(foods);
        }

        if (this.targetFood) {
          this.moveTowardFood(pheromones);
        } else {
          // No available food: wander randomly
          if (Math.random() < 0.05) {
            this.dx = Math.random() * 2 - 1;
            this.dy = Math.random() * 2 - 1;
          }
        }
      } else {
        // Carrying food back to the nest
        this.moveTowardNest(nest, pheromones);
      }

      // Avoid obstacles
      avoidObstacles(this, obstacles);

      // Update position
      this.x += this.dx;
      this.y += this.dy;
    },

    draw(ctx) {
      ctx.fillStyle = this.carryingFood ? 'green' : 'black';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    },

    chooseNearestFood(foods) {
      let nearestFood = null;
      let nearestDistance = Infinity;

      foods.forEach((food) => {
        if (food.capacity > 0) {
          const distance = Math.hypot(this.x - food.x, this.y - food.y);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestFood = food;
          }
        }
      });

      this.targetFood = nearestFood;
    },

    moveTowardFood(pheromones) {
        const angle = Math.atan2(this.targetFood.y - this.y, this.targetFood.x - this.x);
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
      
        const distanceToFood = Math.hypot(
          this.targetFood.x - this.x,
          this.targetFood.y - this.y
        );
        if (distanceToFood < 5) {
          // Reached the food
          this.carryingFood = true;
          this.targetFood.capacity -= 1;
      
          // Drop pheromones
          if (pheromones) { // Check if pheromones array exists
            for (let i = 0; i < 10; i++) {
              pheromones.push({
                x: this.x - this.dx * i,
                y: this.y - this.dy * i,
                intensity: 1.0,
              });
            }
          }
        }
      },

    moveTowardNest(nest, pheromones) {
      const angle = Math.atan2(nest.y - this.y, nest.x - this.x);
      this.dx = Math.cos(angle);
      this.dy = Math.sin(angle);

      const distanceToNest = Math.hypot(nest.x - this.x, nest.y - this.y);
      if (distanceToNest < nest.radius) {
        // Deposited food into nest
        this.carryingFood = false;

        // Wander randomly after depositing food
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
      }
    },
  };
};

export const updateAnts = (ants, foods, obstacles, pheromones, nest, newFoodAdded) => {
    ants.forEach((ant) => {
      ant.update(foods, obstacles, pheromones, nest, newFoodAdded);
    });
  };

const avoidObstacles = (ant, obstacles) => {
  obstacles.forEach((obstacle) => {
    const dx = ant.x - obstacle.x;
    const dy = ant.y - obstacle.y;
    const distance = Math.hypot(dx, dy);

    if (distance < obstacle.size + 5) {
      const avoidAngle = Math.atan2(dy, dx);
      ant.dx += Math.cos(avoidAngle) * 0.5;
      ant.dy += Math.sin(avoidAngle) * 0.5;

      const magnitude = Math.hypot(ant.dx, ant.dy);
      if (magnitude > 0) {
        ant.dx /= magnitude;
        ant.dy /= magnitude;
      }
    }
  });
};
