import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getLandingPage(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Respi | Reservations Backend</title>
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
                <a href="#inicio" class="hover:text-white transition">Home</a>
                <a href="#tecnologias" class="hover:text-white transition">Technologies</a>
                <a href="#repos" class="hover:text-white transition">Code</a>
                <a href="#equipo" class="hover:text-white transition">Authors</a>
            </div>
            <div class="flex gap-3">
                <!-- Botón Navbar para la Web Principal -->
                <a href="https://respi.es" class="hidden sm:block border border-[#F5CA7E]/40 px-5 py-2 rounded-lg text-sm font-bold text-[#F5CA7E] hover:bg-[#F5CA7E] hover:text-black transition">
                    VIEW WEBSITE
                </a>
                <a href="/api/swagger/" class="btn-brand px-6 py-2 rounded-lg text-sm font-bold transition transform hover:scale-105">
                    SWAGGER API
                </a>
            </div>
        </nav>

        <section id="inicio" class="min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center">
            <div data-aos="fade-up">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5CA7E]/10 border border-[#F5CA7E]/20 text-[#F5CA7E] text-xs font-bold mb-6 tracking-widest uppercase">
                    <span class="w-2 h-2 rounded-full bg-[#F5CA7E] animate-pulse"></span>
                    Sports Management System
                </div>
                <h1 class="text-6xl md:text-8xl font-extrabold leading-none tracking-tighter mb-8">
                    Book your court, <br><span class="respi-gradient-text">Play the game.</span>
                </h1>
                <p class="text-[#929293] max-w-2xl text-lg mb-12 mx-auto">
                    High-availability infrastructure for sports facility management. 
                    Optimization of reservations, memberships and automated payment flows.
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                    <!-- BOTÓN A LA WEB PRINCIPAL -->
                    <a href="https://respi.es" class="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all rounded-xl font-bold flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        Go to Respi.es
                    </a>

                    <a href="/api/swagger/" class="px-8 py-4 btn-brand transition-all rounded-xl font-bold shadow-lg shadow-[#F5CA7E]/20">
                        API Documentation
                    </a>
                    
                    <a href="#tecnologias" class="px-8 py-4 glass text-white hover:bg-white/5 transition-all rounded-xl font-bold border border-white/10">
                        Explore Stack
                    </a>
                </div>
            </div>
        </section>

        <!-- ... Resto de secciones (tecnologías, repos, equipo, footer) se mantienen igual ... -->
        
        <section id="tecnologias" class="py-24 px-6 max-w-7xl mx-auto">
            <h2 class="text-center text-slate-500 uppercase tracking-[0.4em] text-xs font-bold mb-4" data-aos="fade-up">Fullstack Architecture</h2>
            <h3 class="text-4xl font-extrabold text-center mb-16" data-aos="fade-up">Main Technologies</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up">
                    <div class="text-red-500 text-3xl mb-4 font-bold">NestJS</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Progressive Node.js framework for building efficient and scalable server-side applications. Modular architecture and intensive use of TypeScript.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="100">
                    <div class="text-blue-400 text-3xl mb-4 font-bold">React Native</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Development of cross-platform mobile application. Smooth native user experience for iOS and Android from a single codebase.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="200">
                    <div class="text-[#F5CA7E] text-3xl mb-4 font-bold">MariaDB</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Robust relational database management system. Ensures the integrity of reservations, payments and sensitive user data.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="300">
                    <div class="text-cyan-400 text-3xl mb-4 font-bold">Docker</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Complete containerization of the environment. Orchestration via Docker Compose to ensure consistency between development and production.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="400">
                    <div class="text-orange-400 text-3xl mb-4 font-bold">TypeORM</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Advanced ORM for TypeScript. Efficient management of migrations, complex relationships and initial data loading via Seeders.
                    </p>
                </div>
                <div class="glass p-8 rounded-3xl card-hover transition-all" data-aos="fade-up" data-aos-delay="500">
                    <div class="text-purple-400 text-3xl mb-4 font-bold">Auth JWT</div>
                    <p class="text-[#929293] text-sm leading-relaxed">
                        Security based on JSON Web Token for robust authentication and secure session management in the mobile application.
                    </p>
                </div>
            </div>
        </section>

        <section id="repos" class="py-24 px-6 max-w-5xl mx-auto">
            <h2 class="text-center text-slate-500 uppercase tracking-[0.3em] text-xs font-bold mb-12" data-aos="fade-up">Version Control</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href="https://github.com/Christopher-Blc/ProyectoApp_Acceso_A_Datos.git" target="_blank" class="glass p-10 rounded-[35px] card-hover transition-all block group" data-aos="fade-right">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-[#F5CA7E] font-bold text-2xl group-hover:underline">Respi Backend</h3>
                        <span class="text-xs bg-white/10 px-2 py-1 rounded">V 1.0</span>
                    </div>
                    <p class="text-sm text-slate-400">Server infrastructure, RESTful API and MariaDB Database.</p>
                </a>
                <a href="https://github.com/Christopher-Blc/Respi_Frontend.git" target="_blank" class="glass p-10 rounded-[35px] card-hover transition-all block group" data-aos="fade-left">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-[#F5CA7E] font-bold text-2xl group-hover:underline">Respi Frontend</h3>
                        <span class="text-xs bg-white/10 px-2 py-1 rounded">V 1.0</span>
                    </div>
                    <p class="text-sm text-slate-400">Mobile application built with React Native and custom styles.</p>
                </a>
            </div>
        </section>

        <section id="equipo" class="py-32 px-6">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-center text-slate-500 uppercase tracking-[0.3em] text-xs font-bold mb-4" data-aos="fade-up">Development Team</h2>
                <h3 class="text-4xl font-extrabold mb-20" data-aos="fade-up">System Architects</h3>
                
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
                © Respi 2026 All rights reserved | Ontinyent, Spain
            </div>
        </footer>

        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script>
            AOS.init({ duration: 800, once: true });
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