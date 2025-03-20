import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Button from "../../shared/ui/Button";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    // 화면 크기에 맞게 캔버스 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = ["#00BFFF", "#87CEFA", "#ADD8E6", "#87CEEB", "#485493"];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      if (!ctx) return;
      const maxDistance = 150;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(135, 206, 250, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-[100vh] overflow-hidden flex items-center justify-center">
      {/* 배경 캔버스 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-dark via-primary/40 to-secondary/70 z-0"
      />

      {/* 백그라운드 블러 효과 */}
      <div className="absolute inset-0 backdrop-blur-[2px] z-10"></div>

      {/* 콘텐츠 */}
      <div className="container-custom relative z-20 py-20">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* 왼쪽: 텍스트 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight">
              <span className="block text-2xl md:text-3xl font-medium mb-2 text-tertiary opacity-90">
                부산대학교
              </span>
              정보의생명공학대학
              <span className="block mt-2 text-highlight drop-shadow-md">
                학생회 &ldquo;정의&rdquo;
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-10 text-white/90 max-w-xl">
              부산대학교 정보의생명공학대학 제2대 학생회 정의는 학생들의 행복한
              대학 생활과 미래를 위한 든든한 디딤돌이 되겠습니다.
            </p>

            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              <Button
                variant="secondary"
                size="lg"
                className="shadow-xl hover:shadow-secondary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold px-8 rounded-full"
              >
                학생회 소개
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-md font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 px-8"
              >
                공지사항 보기
              </Button>
            </div>
          </motion.div>

          {/* 오른쪽: 3D 회전 카드 효과 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2 p-4"
          >
            <div className="perspective-1000 w-full mx-auto max-w-md">
              <motion.div
                animate={{
                  rotateY: [0, 5, 0, -5, 0],
                  rotateX: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
                className="relative w-full aspect-square rounded-2xl shadow-2xl bg-gradient-to-br from-primary to-dark p-1"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-dark to-primary opacity-70 backdrop-blur-md"></div>
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute w-[500px] h-[500px] -top-[250px] -left-[250px] bg-primary/30 rounded-full blur-3xl"></div>
                  <div className="absolute w-[500px] h-[500px] -bottom-[250px] -right-[250px] bg-highlight/30 rounded-full blur-3xl"></div>
                </div>

                <div className="relative w-full h-full flex flex-col items-center justify-center text-white p-10 text-center">
                  <div className="w-24 h-24 mb-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">정의</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    정보의생명공학대학
                  </h3>
                  <p className="text-lg text-white/80 mb-8">
                    학문과 기술의 융합
                  </p>
                  <div className="flex gap-2">
                    {["정보", "융합", "미래", "혁신", "생명"].map(
                      (keyword, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-sm bg-white/10 backdrop-blur-md"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 하단 스크롤 안내 */}
      </div>

      {/* 커스텀 스타일 */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
