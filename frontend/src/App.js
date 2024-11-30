import React, { useState, useEffect, useRef } from "react";

const Game = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw player
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.fillStyle = "blue"; // Player color
      ctx.fillRect(player.x, player.y, 20, 20); // Draw player
    };

    // Game loop
    const loop = () => {
      draw();
      requestAnimationFrame(loop);
    };
    loop();
  }, [player]);

  // Move player on key press
  const handleKeyDown = (e) => {
    setPlayer((prev) => {
      const newPos = { ...prev };
      if (e.key === "ArrowUp") newPos.y -= 10;
      if (e.key === "ArrowDown") newPos.y += 10;
      if (e.key === "ArrowLeft") newPos.x -= 10;
      if (e.key === "ArrowRight") newPos.x += 10;
      return newPos;
    });
  };

  return (
    <div
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid black" }}
      ></canvas>
    </div>
  );
};

export default Game;
