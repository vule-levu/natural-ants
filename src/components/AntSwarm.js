import React, { useRef, useEffect } from 'react';
import Canvas from './Canvas';
import { initializeAnts, updateAnts } from './Ant';
import { initializeFoods, drawFoods } from './Food';
import { drawObstacles, createObstacle } from './Obstacle';
import { drawPheromones, updatePheromones } from './Pheromone';
import { drawNest } from './Nest';

const AntSwarm = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasWidth = (canvas.width = window.innerWidth);
    const canvasHeight = (canvas.height = window.innerHeight);
    let newFoodAdded = false;
    // Initialize elements
    const nest = { x: canvasWidth / 2, y: canvasHeight / 2, radius: 50 };
    const ants = initializeAnts(canvasWidth, canvasHeight, 50, nest);
    const foods = initializeFoods(3, canvasWidth, canvasHeight);
    const obstacles = [];
    const pheromones = [];

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawNest(ctx, nest);
      drawFoods(ctx, foods);
      drawObstacles(ctx, obstacles);
      drawPheromones(ctx, pheromones);
      ants.forEach((ant) => ant.draw(ctx));
    };

    const animate = () => {
      updateAnts(ants, foods, obstacles, pheromones, nest, newFoodAdded);
      updatePheromones(pheromones);
      draw();
      newFoodAdded = false; // Reset flag after ants have reevaluated
      requestAnimationFrame(animate);
    };

    animate();

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      foods.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, capacity: 10 });
    });

    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      createObstacle(e.clientX - rect.left, e.clientY - rect.top, obstacles, nest);
    });

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      foods.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        capacity: 10,
      });
      newFoodAdded = true; // Notify ants of new food
    });

    return () => {
      canvas.removeEventListener('click', null);
      canvas.removeEventListener('contextmenu', null);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default AntSwarm;
