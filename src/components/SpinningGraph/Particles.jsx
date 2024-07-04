// @ts-nocheck
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/particle.styles.scss";
// Particles component now receives control parameters as props
const Particles = ({ positions, controls }) => {
  const canvasRef = useRef(null);
  const particlesArray = useRef([]);
  const nodeParticlesArray = useRef([]);
  const navigate = useNavigate();
  const mouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const {
      SNAP_DISTANCE,
      SLOW_DOWN_FACTOR,
      ATTRACTION_FACTOR,
      MOUSE_EFFECT,
      MIN_SPEED,
      MAX_SPEED,
      SELF_MOVEMENT,
      NODE_PARTICLE_SIZE_MIN,
      NODE_PARTICLE_SIZE_MAX,
    } = controls;

    // Particle class
    class Particle {
      constructor(
        x,
        y,
        directionX,
        directionY,
        size,
        color,
        isNode = false,
        node = null
      ) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.baseSize = size;
        this.color = color;
        this.isNode = isNode;
        this.node = node;
      }

      draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();

        if (this.isNode && this.node) {
          context.fillStyle = "#ffffff";
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(this.node.name, this.x, this.y + 3);
        }
      }

      update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.directionY = -this.directionY;
        }

        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Adjust speed based on mouse effect
        if (MOUSE_EFFECT < 0) {
          // Slow down around mouse, move by themselves elsewhere
          if (distance < SNAP_DISTANCE) {
            this.directionX += dx * (ATTRACTION_FACTOR * (MOUSE_EFFECT / -10));
            this.directionY += dy * (ATTRACTION_FACTOR * (MOUSE_EFFECT / -10));
          } else {
            this.directionX *= SLOW_DOWN_FACTOR - MOUSE_EFFECT / -100;
            this.directionY *= SLOW_DOWN_FACTOR - MOUSE_EFFECT / -100;
          }
        } else {
          // Move faster around mouse, slow down elsewhere
          if (distance < SNAP_DISTANCE) {
            this.directionX += dx * (ATTRACTION_FACTOR * (MOUSE_EFFECT / 10));
            this.directionY += dy * (ATTRACTION_FACTOR * (MOUSE_EFFECT / 10));
          } else {
            this.directionX *= SLOW_DOWN_FACTOR + MOUSE_EFFECT / 100;
            this.directionY *= SLOW_DOWN_FACTOR + MOUSE_EFFECT / 100;
          }
        }

        // Self-movement
        this.directionX += (Math.random() - 0.5) * SELF_MOVEMENT;
        this.directionY += (Math.random() - 0.5) * SELF_MOVEMENT;

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }

      isClicked(mouseX, mouseY) {
        const distance = Math.sqrt(
          (this.x - mouseX) ** 2 + (this.y - mouseY) ** 2
        );
        return distance < this.size;
      }
    }

    // Initialize particles
    const init = () => {
      particlesArray.current.length = 0;
      nodeParticlesArray.current.length = 0;

      // Add particles at the positions of the spinning graph nodes
      positions.forEach((pos) => {
        if (pos) {
          nodeParticlesArray.current.push(
            new Particle(
              pos.cx,
              pos.cy,
              Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED,
              Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED,
              NODE_PARTICLE_SIZE_MIN,
              "#ff0000",
              true,
              pos.node
            )
          );
        }
      });

      // Add remaining particles
      for (let i = 0; i < 380; i++) {
        const size = Math.random() * (5 - 2) + 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const directionX = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        const directionY = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;

        particlesArray.current.push(
          new Particle(x, y, directionX, directionY, size, "#ffffff")
        );
      }
    };

    // Connect particles with lines
    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.current.length; a++) {
        for (let b = a; b < particlesArray.current.length; b++) {
          const distance =
            (particlesArray.current[a].x - particlesArray.current[b].x) *
              (particlesArray.current[a].x - particlesArray.current[b].x) +
            (particlesArray.current[a].y - particlesArray.current[b].y) *
              (particlesArray.current[a].y - particlesArray.current[b].y);
          if (distance < (window.innerWidth / 7) * (window.innerHeight / 7)) {
            opacityValue = 1 - distance / 20000;
            context.strokeStyle = `rgba(255,255,255,${opacityValue})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(
              particlesArray.current[a].x,
              particlesArray.current[a].y
            );
            context.lineTo(
              particlesArray.current[b].x,
              particlesArray.current[b].y
            );
            context.stroke();
          }
        }
      }

      // Connect node particles
      for (let a = 0; a < nodeParticlesArray.current.length; a++) {
        for (let b = a + 1; b < nodeParticlesArray.current.length; b++) {
          const distance =
            (nodeParticlesArray.current[a].x -
              nodeParticlesArray.current[b].x) *
              (nodeParticlesArray.current[a].x -
                nodeParticlesArray.current[b].x) +
            (nodeParticlesArray.current[a].y -
              nodeParticlesArray.current[b].y) *
              (nodeParticlesArray.current[a].y -
                nodeParticlesArray.current[b].y);
          if (distance < (window.innerWidth / 7) * (window.innerHeight / 7)) {
            opacityValue = 1 - distance / 20000;
            context.strokeStyle = `rgba(255,192,203,${opacityValue})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(
              nodeParticlesArray.current[a].x +
                (nodeParticlesArray.current[a].size *
                  (nodeParticlesArray.current[a].x -
                    nodeParticlesArray.current[b].x)) /
                  distance,
              nodeParticlesArray.current[a].y +
                (nodeParticlesArray.current[a].size *
                  (nodeParticlesArray.current[a].y -
                    nodeParticlesArray.current[b].y)) /
                  distance
            );
            context.lineTo(
              nodeParticlesArray.current[b].x +
                (nodeParticlesArray.current[b].size *
                  (nodeParticlesArray.current[b].x -
                    nodeParticlesArray.current[a].x)) /
                  distance,
              nodeParticlesArray.current[b].y +
                (nodeParticlesArray.current[b].size *
                  (nodeParticlesArray.current[b].y -
                    nodeParticlesArray.current[a].y)) /
                  distance
            );
            context.stroke();
          }
        }
      }
    };

    // Animate particles
    const animate = () => {
      requestAnimationFrame(animate);
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.current.length; i++) {
        particlesArray.current[i].update();
      }

      connect();

      for (let i = 0; i < nodeParticlesArray.current.length; i++) {
        nodeParticlesArray.current[i].update();
      }
    };

    init();
    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });

    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = event.clientX - rect.left;
      mouse.current.y = event.clientY - rect.top;
    });

    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      nodeParticlesArray.current.forEach((particle) => {
        if (particle.isClicked(mouseX, mouseY)) {
          navigate(particle.node.link);
        }
      });
    });

    return () => {
      window.removeEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
      });

      canvas.removeEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = event.clientX - rect.left;
        mouse.current.y = event.clientY - rect.top;
      });

      canvas.removeEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        nodeParticlesArray.current.forEach((particle) => {
          if (particle.isClicked(mouseX, mouseY)) {
            navigate(particle.node.link);
          }
        });
      });
    };
  }, [positions, controls, navigate]);

  return <canvas ref={canvasRef} id="particles-js"></canvas>;
};

export default Particles;
