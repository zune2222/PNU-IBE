import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Button from "../../shared/ui/Button";
import Image from "next/image";

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
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight">
              <span className="block text-xl sm:text-2xl md:text-3xl font-medium mb-2 text-tertiary opacity-90">
                부산대학교
              </span>
              정보의생명공학대학
            </h1>

            <div className="relative max-w-xl">
              {/* 배경 그라디언트 효과 */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute w-[200px] h-[200px] -top-[100px] -left-[100px] bg-blue-400/30 rounded-full blur-3xl"></div>
                <div className="absolute w-[200px] h-[200px] -bottom-[100px] -right-[100px] bg-purple-400/30 rounded-full blur-3xl"></div>
              </div>

              <p className="relative text-lg md:text-xl mb-10 text-white p-6 rounded-3xl bg-white/15 backdrop-blur-lg border border-white/25 shadow-2xl hover:bg-white/20 transition-all duration-500 drop-shadow-md">
                부산대학교 정보의생명공학대학 제2대 학생회 정의는 학생들의
                행복한 대학 생활과 미래를 위한 든든한 디딤돌이 되겠습니다.
              </p>
            </div>

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
                  rotateY: [0, 3, 0, -3, 0],
                  rotateX: [0, 2, 0, -2, 0],
                }}
                transition={{
                  duration: 12,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
                className="relative w-full aspect-square rounded-3xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-1 hover:bg-white/15 transition-all duration-500"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 글래스모피즘 오버레이 */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl"></div>

                {/* 배경 그라디언트 효과 */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute w-[300px] h-[300px] -top-[150px] -left-[150px] bg-blue-400/20 rounded-full blur-3xl"></div>
                  <div className="absolute w-[300px] h-[300px] -bottom-[150px] -right-[150px] bg-purple-400/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative w-full h-full flex flex-col items-center justify-center text-white p-6 sm:p-8 md:p-10 text-center">
                  <motion.div
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-4 sm:mb-6 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center overflow-hidden relative border-2 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    whileHover={{ scale: 1.05 }}
                    animate={{
                      boxShadow: [
                        "0 0 10px rgba(255,255,255,0.3)",
                        "0 0 25px rgba(255,255,255,0.5)",
                        "0 0 10px rgba(255,255,255,0.3)",
                      ],
                    }}
                    transition={{
                      boxShadow: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="부산대학교 정보의생명공학대학 학생회 로고"
                      width={65}
                      height={65}
                      className="z-10 relative w-auto h-auto max-w-[60%] max-h-[60%] sm:max-w-[70%] sm:max-h-[70%]"
                    />
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-slate-700 drop-shadow-lg">
                    정보의생명공학대학
                  </h3>

                  <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 font-medium drop-shadow-md">
                    학문과 기술의 융합
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {["정보", "융합", "미래", "혁신", "생명"].map(
                      (keyword, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-white/25 backdrop-blur-md border border-white/30 text-slate-700 font-medium shadow-lg hover:bg-white/35 transition-all duration-300"
                        >
                          {keyword}
                        </motion.span>
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
