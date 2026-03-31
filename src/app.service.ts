import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getLandingPage(): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Respi | Backend de Reservas</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
            
            :root {
                --respi-brand: #F5CA7E;
                --respi-bg: #191919;
                --respi-surface: #272727;
                --respi-text-sec: #929293;
            }

            body { 
                background-color: var(--respi-bg); 
                color: #FFFFFF; 
                font-family: 'Plus Jakarta Sans', sans-serif;
                overflow-x: hidden;
            }

            .respi-gradient-text {
                background: linear-gradient(to right, var(--respi-brand), var(--respi-text-sec));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .glass { 
                background: var(--respi-surface); 
                border: 1px solid rgba(245, 202, 126, 0.1); 
            }

            .btn-brand {
                background: linear-gradient(to right, var(--respi-brand), #d4ad66);
                color: #191919;
            }

            .card-hover:hover {
                transform: translateY(-8px);
                border-color: var(--respi-brand);
                box-shadow: 0 10px 30px -10px rgba(245, 202, 126, 0.2);
            }

            .author-ball {
                width: 110px;
                height: 110px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 1.8rem;
                transition: all 0.3s ease;
                border: 3px solid transparent;
            }

            .author-ball:hover {
                transform: scale(1.1) rotate(8deg);
                border-color: var(--respi-brand);
            }

            .floating {
                animation: floating 3s ease-in-out infinite;
            }

            @keyframes floating {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }

            /* Scrollbar personalizada */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: var(--respi-bg); }
            ::-webkit-scrollbar-thumb { background: var(--respi-surface); border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--respi-brand); }
        </style>
    </head>
    <body>

        <nav class="fixed w-full z-50 px-6 py-4 flex justify-between items-center glass backdrop-blur-md">
            <div class="text-2xl font-extrabold tracking-tighter text-white">ResPi<span style="color: var(--respi-brand)">.</span></div>
            <div class="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                <a href="#inicio" class="hover:text-white transition">Inicio</a>
                <a href="#tecnologias" class="hover:text-white transition">Tecnologías</a>
                <a href="#repos" class="hover:text-white transition">Código</a>
                <a href="#equipo" class="hover:text-white transition">Autores</a>
            </div>
            <a href="/api" class="btn-brand px-6 py-2 rounded-lg text-sm font-bold transition transform hover:scale-105">
                SWAGGER API
            </a>
        </nav>

        <section id="inicio" class="min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center">
            <div data-aos="fade-up">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5CA7E]/10 border border-[#F5CA7E]/20 text-[#F5CA7E] text-xs font-bold mb-6 tracking-widest uppercase">
                    <span class="w-2 h-2 rounded-full bg-[#F5CA7E] animate-pulse"></span>
                    Sistema de Gestión Deportiva
                </div>
                <h1 class="text-6xl md:text-8xl font-extrabold leading-none tracking-tighter mb-8">
                    Reserva tu pista, <br><span class="respi-gradient-text">Juega el partido.</span>
                </h1>
                <p class="text-[#929293] max-w-2xl text-lg mb-12 mx-auto">
                    Infraestructura de alta disponibilidad para la gestión de instalaciones deportivas. 
                    Optimización de reservas, membresías y flujos de pago automatizados.
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="#tecnologias" class="px-8 py-4 glass text-white hover:bg-white/5 transition-all rounded-xl font-bold border border-white/10">
                        Explorar Stack
                    </a>
                    <a href="/api" class="px-8 py-4 btn-brand transition-all rounded-xl font-bold shadow-lg shadow-[#F5CA7E]/20">
                        Documentación de Endpoints
                    </a>
                </div>
            </div>
        </section>

        <section id="tecnologias" class="py-24 px-6 max-w-7xl mx-auto">
            <h2 class="text-center text-slate-500 uppercase tracking-[0.4em] text-xs font-bold mb-4" data-aos="fade-up">Fullstack Architecture</h2>
            <h3 class="text-4xl font-extrabold text-center mb-16" data-aos="fade-up">Tecnologías Principales</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up">
                    <div class="text-red-500 text-3xl mb-4 font-bold">NestJS</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables. Arquitectura modular y uso intensivo de TypeScript.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="100">
                    <div class="text-blue-400 text-3xl mb-4 font-bold">React Native</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Desarrollo de la aplicación móvil multiplataforma. Experiencia de usuario nativa fluida para iOS y Android desde una base de código única.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="200">
                    <div class="text-[#F5CA7E] text-3xl mb-4 font-bold">MariaDB</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Sistema de gestión de base de datos relacional robusto. Garantiza la integridad de las reservas, pagos y datos sensibles de los usuarios.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="300">
                    <div class="text-cyan-400 text-3xl mb-4 font-bold">Docker</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Contenerización completa del entorno. Orquestación mediante Docker Compose para asegurar consistencia entre desarrollo y producción.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="400">
                    <div class="text-orange-400 text-3xl mb-4 font-bold">TypeORM</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        ORM avanzado para TypeScript. Gestión eficiente de migraciones, relaciones complejas y carga de datos iniciales mediante Seeders.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="500">
                    <div class="text-purple-400 text-3xl mb-4 font-bold">Auth JWT</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Seguridad basada en tokens JSON Web Token para una autenticación robusta y manejo de sesiones seguras en la aplicación móvil.
                    </p>
                </div>
            </div>
        </section>

        <section id="repos" class="py-24 px-6 max-w-5xl mx-auto">
            <h2 class="text-center text-slate-500 uppercase tracking-[0.3em] text-xs font-bold mb-12" data-aos="fade-up">Control de Versiones</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href="https://github.com/Christopher-Blc/ProyectoApp_Acceso_A_Datos.git" target="_blank" class="glass p-10 rounded-[35px] card-hover transition-all block group" data-aos="fade-right">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-[#F5CA7E] font-bold text-2xl group-hover:underline">Respi Backend</h3>
                        <span class="text-xs bg-white/10 px-2 py-1 rounded">V 1.0</span>
                    </div>
                    <p class="text-sm text-slate-400">Infraestructura del servidor, API RESTful y Base de Datos MariaDB.</p>
                </a>
                <a href="https://github.com/Christopher-Blc/Respi_Frontend.git" target="_blank" class="glass p-10 rounded-[35px] card-hover transition-all block group" data-aos="fade-left">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-[#F5CA7E] font-bold text-2xl group-hover:underline">Respi Frontend</h3>
                        <span class="text-xs bg-white/10 px-2 py-1 rounded">V 1.0</span>
                    </div>
                    <p class="text-sm text-slate-400">Aplicación móvil construida con React Native y estilos personalizados.</p>
                </a>
            </div>
        </section>

        <section id="equipo" class="py-32 px-6">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-center text-slate-500 uppercase tracking-[0.3em] text-xs font-bold mb-4" data-aos="fade-up">Development Team</h2>
                <h3 class="text-4xl font-extrabold mb-20" data-aos="fade-up">Arquitectos del Sistema</h3>
                
                <div class="flex flex-wrap justify-center gap-12 md:gap-24">
                    <div class="flex flex-col items-center" data-aos="zoom-in" data-aos-delay="100">
                        <div class="author-ball floating shadow-lg" style="background: linear-gradient(135deg, #585757, #292929); color: var(--respi-brand);">C</div>
                        <span class="mt-6 font-bold text-slate-300 tracking-wide text-lg">Christopher</span>
                    </div>
                    <div class="flex flex-col items-center" data-aos="zoom-in" data-aos-delay="200">
                        <div class="author-ball floating shadow-lg" style="background: linear-gradient(135deg, #F5CA7E, #929293); color: #191919;">M</div>
                        <span class="mt-6 font-bold text-slate-300 tracking-wide text-lg">Mauro</span>
                    </div>
                    <div class="flex flex-col items-center" data-aos="zoom-in" data-aos-delay="300">
                        <div class="author-ball floating shadow-lg" style="background: linear-gradient(135deg, #292929, #585757); color: var(--respi-brand);">J</div>
                        <span class="mt-6 font-bold text-slate-300 tracking-wide text-lg">Javi</span>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-16 border-t border-white/5 text-center px-6">
            <div class="text-[#929293] text-[11px] uppercase tracking-[0.5em] mb-4">
                Respi Project 2026 • NestJS • React Native • MariaDB • Dockerized
            </div>
            <div class="text-slate-500 text-xs tracking-wider">
                @ Respi 2026 All rights reserved | Ontinyent, España
            </div>
        </footer>

        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script>
            AOS.init({ duration: 800, once: true });
            
            // Efecto de scroll suave
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            });
        </script>
    </body>
    </html>
    `;
  }
}