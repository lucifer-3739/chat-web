"use client"
import React, { useEffect, useRef } from 'react';

const DotsBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const background = backgroundRef.current!;
        const ctx = canvas.getContext('2d')!;
        let dots: { x: number; y: number; size: number; color: string }[] = [];
        const arrayColors = ['#900cff', '#1d0cff', '#00ba24', '#ffb910', '#ff1010'];

        const setCanvasSize = () => {
            canvas.width = background.offsetWidth;
            canvas.height = background.offsetHeight;
            dots = [];
            for (let index = 0; index < 100; index++) {
                dots.push({
                    x: Math.floor(Math.random() * canvas.width),
                    y: Math.floor(Math.random() * canvas.height),
                    size: Math.random() * 3 + 5,
                    color: arrayColors[Math.floor(Math.random() * 5)]
                });
            }
        };

        const drawDots = () => {
            dots.forEach(dot => {
                ctx.fillStyle = dot.color;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        setCanvasSize();
        drawDots();

        const handleMouseMove = (event: MouseEvent) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawDots();
            let mouse = {
                x: event.pageX - background.getBoundingClientRect().left,
                y: event.pageY - background.getBoundingClientRect().top
            };
            dots.forEach(dot => {
                let distance = Math.sqrt((mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2);
                if (distance < 300) {
                    ctx.strokeStyle = dot.color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            });
        };

        const handleMouseOut = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawDots();
        };

        const handleResize = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setCanvasSize();
            drawDots();
        };

        background.addEventListener('mousemove', handleMouseMove);
        background.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('resize', handleResize);

        return () => {
            background.removeEventListener('mousemove', handleMouseMove);
            background.removeEventListener('mouseout', handleMouseOut);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={backgroundRef} className="absolute w-full h-full top-0 left-0">
            <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
        </div>
    );
};

export default DotsBackground;
