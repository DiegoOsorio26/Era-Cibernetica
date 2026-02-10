/**
 * Sistema de animaciones con canvas
 * Crea circuitos digitales y efectos visuales
 */

class CircuitAnimator {
    constructor() {
        this.canvas = document.getElementById('circuitCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        
        this.particles = [];
        this.nodes = [];
        this.initParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    initParticles() {
        // Crear nodos aleatorios
        const nodeCount = Math.floor(this.width / 150);
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }

        // Crear partículas
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                maxLife: Math.random() * 0.5 + 0.5
            });
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Actualizar y dibujar nodos
        this.nodes.forEach((node, i) => {
            node.x += node.vx;
            node.y += node.vy;

            // Rebotar en bordes
            if (node.x < 0 || node.x > this.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.height) node.vy *= -1;

            node.x = Math.max(0, Math.min(this.width, node.x));
            node.y = Math.max(0, Math.min(this.height, node.y));

            // Dibujar nodo
            this.ctx.fillStyle = '#00d4ff';
            this.ctx.fillRect(node.x - node.size, node.y - node.size, node.size * 2, node.size * 2);

            // Conectar nodos cercanos
            this.nodes.forEach((otherNode, j) => {
                if (i !== j) {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 200) {
                        this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 200)})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(node.x, node.y);
                        this.ctx.lineTo(otherNode.x, otherNode.y);
                        this.ctx.stroke();
                    }
                }
            });
        });

        // Actualizar y dibujar partículas
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.01;

            // Rebotar
            if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;

            particle.x = Math.max(0, Math.min(this.width, particle.x));
            particle.y = Math.max(0, Math.min(this.height, particle.y));

            // Dibujar partícula
            const colors = ['#00d4ff', '#00ffff', '#b300ff', '#00ff41'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.ctx.fillStyle = `${color}${Math.floor(particle.life * 255).toString(16)}`;
            this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);

            // Regenerar partículas muertas
            if (particle.life <= 0) {
                this.particles[i] = {
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1,
                    maxLife: Math.random() * 0.5 + 0.5
                };
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Iniciar animaciones cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CircuitAnimator();
    });
} else {
    new CircuitAnimator();
}