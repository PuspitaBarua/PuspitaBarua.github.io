// Enhanced Portfolio JavaScript with Advanced Features

// Utility Functions
const utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Generate random number between min and max
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};

// Preloader Management
class PreloaderManager {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hidePreloader();
            }, 1500);
        });
    }

    hidePreloader() {
        if (this.preloader) {
            this.preloader.style.opacity = '0';
            setTimeout(() => {
                this.preloader.style.display = 'none';
            }, 500);
        }
    }
}

// Custom Cursor Management
class CursorManager {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.cursorDot = this.cursor?.querySelector('.cursor-dot');
        this.cursorOutline = this.cursor?.querySelector('.cursor-outline');
        this.init();
    }

    init() {
        if (!this.cursor) return;

        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            this.updateCursorPosition(e.clientX, e.clientY);
        });

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .social-link, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.expandCursor());
            el.addEventListener('mouseleave', () => this.contractCursor());
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => this.hideCursor());
        document.addEventListener('mouseenter', () => this.showCursor());
    }

    updateCursorPosition(x, y) {
        if (this.cursor) {
            this.cursor.style.left = x + 'px';
            this.cursor.style.top = y + 'px';
        }
    }

    expandCursor() {
        if (this.cursorOutline) {
            this.cursorOutline.style.transform = 'scale(1.5)';
            this.cursorOutline.style.opacity = '0.8';
        }
    }

    contractCursor() {
        if (this.cursorOutline) {
            this.cursorOutline.style.transform = 'scale(1)';
            this.cursorOutline.style.opacity = '0.5';
        }
    }

    hideCursor() {
        if (this.cursor) {
            this.cursor.style.opacity = '0';
        }
    }

    showCursor() {
        if (this.cursor) {
            this.cursor.style.opacity = '1';
        }
    }
}

// Enhanced Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // System theme detection
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(() => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(mediaQuery.matches ? 'dark' : 'light');
                }
            });
        }
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update icon with animation
        if (this.themeIcon) {
            this.themeIcon.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                this.themeIcon.style.transform = 'rotate(0deg)';
            }, 150);
        }

        // Trigger theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Enhanced Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        // Scroll effect with throttling
        window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 16));

        // Mobile menu toggle
        this.hamburger?.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.closeMobileMenu();
            });
        });

        // Active link highlighting
        window.addEventListener('scroll', utils.throttle(() => this.updateActiveLink(), 16));

        // Smooth scrolling for all anchor links
        this.setupSmoothScrolling();

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    handleScroll() {
        const scrolled = window.scrollY > 100;
        this.navbar?.classList.toggle('scrolled', scrolled);
    }

    toggleMobileMenu() {
        this.hamburger?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu?.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                activeLink?.classList.add('active');
            }
        });
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                if (targetId) {
                    this.scrollToSection(targetId);
                }
            });
        });
    }
}

// Enhanced Animation Manager
class AnimationManager {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out-cubic',
                once: true,
                offset: 100
            });
        }

        // Custom animations
        this.initCounterAnimations();
        this.initTypingAnimation();
        this.initParticleBackground();
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        // Intersection Observer for counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    animateCounter(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    initTypingAnimation() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };

            // Start typing animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        setTimeout(typeWriter, 500);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(element);
        });
    }

    initParticleBackground() {
        // Add floating particles to hero section
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${utils.random(2, 6)}px;
                height: ${utils.random(2, 6)}px;
                background: var(--primary-color);
                border-radius: 50%;
                opacity: ${utils.random(20, 60) / 100};
                left: ${utils.random(0, 100)}%;
                top: ${utils.random(0, 100)}%;
                animation: float ${utils.random(3, 8)}s ease-in-out infinite;
                animation-delay: ${utils.random(0, 5)}s;
                pointer-events: none;
            `;
            hero.appendChild(particle);
        }
    }
}

// Enhanced Skills Animation
class SkillsAnimator {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.progressBars = document.querySelectorAll('.progress-bar');
        this.animated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkills();
                    this.animateProgressBars();
                }
            });
        }, { threshold: 0.3 });

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                if (progress) {
                    bar.style.width = progress + '%';
                }
            }, index * 200);
        });
    }

    animateProgressBars() {
        this.progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                if (progress) {
                    bar.style.width = progress + '%';
                }
            }, index * 150);
        });
    }
}

// Enhanced Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = this.form?.querySelector('.btn-submit');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupFormValidation();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('.form-input, .form-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--error-color)';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--error-color);
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: fadeInUp 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('.form-input, .form-textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate form submission
            await this.simulateFormSubmission();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
            
            console.log('Form data:', data);
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        if (this.submitBtn) {
            this.submitBtn.classList.toggle('loading', loading);
            this.submitBtn.disabled = loading;
        }
    }

    simulateFormSubmission() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Enhanced CV Download Handler
class CVDownloadHandler {
    constructor() {
        this.cvDropdownBtn = document.getElementById('cv-dropdown-btn');
        this.cvDropdownMenu = document.getElementById('cv-dropdown-menu');
        this.cvDropdown = document.querySelector('.cv-dropdown');
        this.academicCvBtn = document.getElementById('download-academic-cv');
        this.professionalCvBtn = document.getElementById('download-professional-cv');
        this.footerCvBtn = document.getElementById('footer-cv');
        this.init();
    }

    init() {
        // CV Dropdown toggle
        this.cvDropdownBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleDropdown();
        });

        // Academic CV download
        this.academicCvBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleDownload(e, 'academic');
            this.closeDropdown();
        });

        // Professional CV download
        this.professionalCvBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleDownload(e, 'professional');
            this.closeDropdown();
        });

        // Footer CV download (default to academic)
        this.footerCvBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleDownload(e, 'academic');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.cvDropdown?.contains(e.target)) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        this.cvDropdown?.classList.toggle('active');
    }

    closeDropdown() {
        this.cvDropdown?.classList.remove('active');
    }

    handleDownload(e, type = 'academic') {
        e.preventDefault();

        // Add download animation
        const button = e.target.closest('button') || e.target;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        const cvContent = type === 'academic' ? 
            this.generateAcademicCVContent() : 
            this.generateProfessionalCVContent();
        
        const filename = type === 'academic' ? 
            'Puspita_Barua_Academic_CV.txt' : 
            'Puspita_Barua_Professional_CV.txt';
        
        this.downloadFile(cvContent, filename, 'text/plain');
        this.showDownloadNotification(type);
    }

    generateAcademicCVContent() {
        return `
═══════════════════════════════════════════════════════════════
                        PUSPITA BARUA
           Undergraduate Student (Level 3, Term 2)
        Electronics & Telecommunication Engineering
        Chittagong University of Engineering & Technology (CUET)
═══════════════════════════════════════════════════════════════

📧 CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: puspitabarua24.ctg@gmail.com
Location: Chittagong, Bangladesh
GitHub: https://github.com/PuspitaBarua
Portfolio: [Your Portfolio URL]

🎓 EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bachelor of Science - Electronics & Telecommunication Engineering
Chittagong University of Engineering & Technology (CUET)
Current Level: 3, Term 2 (Undergraduate Student)
Expected Graduation: 2025

Academic Performance:
• Consistent academic excellence throughout undergraduate studies
• Strong foundation in core engineering subjects
• Active participation in laboratory work and practical sessions

Higher Secondary Certificate (HSC) - Science Group
Chittagong College | Year: 2021 | GPA: 5.00/5.00
• Perfect score achievement in Science Group
• Strong background in Physics, Chemistry, and Mathematics

Secondary School Certificate (SSC) - Science Group
Chittagong Engineering University School & College
Year: 2019 | GPA: 5.00/5.00
• Excellence in Sciences with perfect GPA
• Foundation in analytical and problem-solving skills

📚 ACADEMIC COURSEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Core Engineering Subjects:
• Digital Logic Design (Level 2, Term 2)
• Digital Communication (Level 3, Term 1)
• Internet Programming (Level 3, Term 1)
• Circuit Analysis and Electronics
• Signal Processing and Communication Systems
• Microprocessor and Microcontroller Systems
• Electromagnetic Theory and Applications

Laboratory Experience:
• Digital Logic Design Lab - Hardware implementation projects
• Communication Systems Lab - Modulation/Demodulation experiments
• Programming Lab - Software development and web technologies
• Electronics Lab - Circuit design and testing

💻 TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Programming Languages:
• C (Advanced) - 90%
• C++ (Advanced) - 85%
• Python (Intermediate) - 80%
• Java (Intermediate) - 75%
• PHP (Intermediate) - 70%

Web Technologies:
• HTML5 (Expert) - 95%
• CSS3 (Advanced) - 90%
• JavaScript (Advanced) - 85%
• MySQL (Advanced) - 80%

Software & Tools:
• MATLAB - Signal processing and simulation
• Proteus - Circuit design and simulation
• ADS (Advanced Design System) - RF/Microwave design

Hardware & Embedded Systems:
• Arduino programming and interfacing
• Microcontroller programming (8051, PIC)
• Circuit design and PCB layout
• Digital and analog electronics

🔬 RESEARCH INTERESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Communication Systems & Signal Processing
• Internet of Things (IoT) Applications
• Digital Signal Processing Algorithms
• Wireless Communication Technologies
• Embedded Systems Design

🚀 FEATURED PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Smart Guard: Hybrid Authentication Door Lock System
   Academic Course: Digital Logic Design (Level 2, Term 2)
   • Implemented multi-layer security with RFID, keypad, and biometric authentication
   • Designed solenoid-based locking mechanism with fail-safe features
   • Integrated real-time monitoring and alert system
   • Grade: A+ (Outstanding Performance)
   Technologies: Digital Logic, Microcontroller, Security Systems

2. ASK Modulation & Demodulation Communication System
   Academic Course: Digital Communication (Level 3, Term 1)
   • Designed and implemented Amplitude Shift Keying system
   • Performed comparative analysis between simulation and practical results
   • Analyzed BER performance under different noise conditions
   • Comprehensive report on theoretical vs practical implementation
   Technologies: MATLAB, Signal Processing, Communication Theory

3. Cookistry - Comprehensive Food Recipe Management Platform
   Academic Course: Internet Programming (Level 3, Term 1)
   • Developed full-stack web application with user authentication
   • Implemented recipe sharing, rating, and recommendation system
   • Designed responsive UI with advanced search and filtering
   • Demonstrated proficiency in modern web development practices
   Technologies: PHP, MySQL, HTML5, CSS3, JavaScript

🏆 ACHIEVEMENTS & CERTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Academic Achievements:
• Perfect GPA (5.00/5.00) in both SSC and HSC examinations
• Consistent high performance in undergraduate coursework
• Recognition for excellence in laboratory work and projects
• Strong analytical and problem-solving capabilities

Extracurricular Activities:
• Active participant in university technical competitions
• Member of IEEE Student Branch, CUET Chapter
• Volunteer in university technical events and workshops

🎯 ACADEMIC OBJECTIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
As an undergraduate student in Electronics & Telecommunication Engineering,
I am focused on:

• Completing my degree with academic excellence
• Gaining practical experience through internships and projects
• Developing expertise in communication systems and digital technologies
• Contributing to research in IoT and embedded systems
• Preparing for advanced studies or industry opportunities

📋 CURRENT ACADEMIC STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Level: 3, Term 2 (Undergraduate Student)
Expected Graduation: 2025
University: Chittagong University of Engineering & Technology (CUET)
Department: Electronics & Telecommunication Engineering

═══════════════════════════════════════════════════════════════
Academic CV Generated on: ${new Date().toLocaleDateString()}
Student Status: Undergraduate (Level 3, Term 2)
═══════════════════════════════════════════════════════════════
        `.trim();
    }

    generateProfessionalCVContent() {
        return `
═══════════════════════════════════════════════════════════════
                        PUSPITA BARUA
        Electronics & Telecommunication Engineering Student
        Chittagong University of Engineering & Technology (CUET)
═══════════════════════════════════════════════════════════════

📧 CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: puspitabarua24.ctg@gmail.com
Location: Chittagong, Bangladesh
GitHub: https://github.com/PuspitaBarua
Portfolio: [Your Portfolio URL]

🎓 EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bachelor of Science - Electronics & Telecommunication Engineering
Chittagong University of Engineering & Technology (CUET)
Level 3, Term 2 (Ongoing) | Expected Graduation: 2025

Higher Secondary Certificate (HSC) - Science Group
Chittagong College | Year: 2021 | GPA: 5.00/5.00

Secondary School Certificate (SSC) - Science Group
Chittagong Engineering University School & College
Year: 2019 | GPA: 5.00/5.00

💻 TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Programming Languages:
• C (Advanced) - 90%
• C++ (Advanced) - 85%
• Python (Intermediate) - 80%
• Java (Intermediate) - 75%
• PHP (Intermediate) - 70%

Web Technologies:
• HTML5 (Expert) - 95%
• CSS3 (Advanced) - 90%
• JavaScript (Advanced) - 85%
• MySQL (Advanced) - 80%

Software & Tools:
• MATLAB - Signal processing and simulation
• Proteus - Circuit design and simulation
• ADS (Advanced Design System) - RF/Microwave design

Hardware & Embedded Systems:
• Arduino programming and interfacing
• Microcontroller programming (8051, PIC)
• Circuit design and PCB layout
• Digital and analog electronics

🔬 RESEARCH INTERESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Communication Systems & Signal Processing
• Internet of Things (IoT) Applications
• Digital Signal Processing Algorithms
• Wireless Communication Technologies
• Embedded Systems Design

🚀 FEATURED PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Smart Guard: Hybrid Authentication Door Lock System
   Course: Digital Logic Design (Level 2, Term 2)
   • Implemented multi-layer security with RFID, keypad, and biometric authentication
   • Designed solenoid-based locking mechanism with fail-safe features
   • Integrated real-time monitoring and alert system
   Technologies: Digital Logic, Microcontroller, Security Systems

2. ASK Modulation & Demodulation Communication System
   Course: Digital Communication (Level 3, Term 1)
   • Designed and implemented Amplitude Shift Keying system
   • Performed comparative analysis between simulation and practical results
   • Analyzed BER performance under different noise conditions
   Technologies: MATLAB, Signal Processing, Communication Theory

3. Cookistry - Comprehensive Food Recipe Management Platform
   Course: Internet Programming (Level 3, Term 1)
   • Developed full-stack web application with user authentication
   • Implemented recipe sharing, rating, and recommendation system
   • Designed responsive UI with advanced search and filtering
   Technologies: PHP, MySQL, HTML5, CSS3, JavaScript

🏆 ACHIEVEMENTS & CERTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Perfect GPA (5.00/5.00) in both SSC and HSC examinations
• Dean's List recognition for academic excellence
• Active participant in university technical competitions
• Member of IEEE Student Branch, CUET Chapter

💡 CORE COMPETENCIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Problem-solving and analytical thinking
• Team collaboration and leadership
• Project management and documentation
• Continuous learning and adaptability
• Strong communication skills
• Attention to detail and quality assurance

🎯 CAREER OBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passionate Electronics & Telecommunication Engineering student seeking 
opportunities to apply theoretical knowledge in practical scenarios. 
Eager to contribute to innovative projects in communication systems, 
IoT applications, and embedded systems while continuing to grow 
professionally in a dynamic technology environment.

═══════════════════════════════════════════════════════════════
Professional CV Generated on: ${new Date().toLocaleDateString()}
Last Updated: ${new Date().toLocaleDateString()}
═══════════════════════════════════════════════════════════════
        `.trim();
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    showDownloadNotification(type = 'academic') {
        const cvType = type === 'academic' ? 'Academic CV' : 'Professional CV';
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-download"></i>
                <span>${cvType} downloaded successfully!</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Back to Top Button
class BackToTopManager {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.backToTopBtn) {
            this.createBackToTopButton();
        }

        window.addEventListener('scroll', utils.throttle(() => this.toggleVisibility(), 16));
        this.backToTopBtn?.addEventListener('click', () => this.scrollToTop());
    }

    createBackToTopButton() {
        this.backToTopBtn = document.createElement('button');
        this.backToTopBtn.id = 'backToTop';
        this.backToTopBtn.className = 'back-to-top';
        this.backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        this.backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(this.backToTopBtn);
    }

    toggleVisibility() {
        const scrolled = window.scrollY > 300;
        this.backToTopBtn?.classList.toggle('visible', scrolled);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Enhanced Intersection Observer for animations
class IntersectionAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.animate-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    });
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.timeline-item, .skill-category, .project-card, .stat-card, .contact-item'
        );
        animateElements.forEach(el => observer.observe(el));
    }
}

// Magnetic Button Effect
class MagneticEffects {
    constructor() {
        this.init();
    }

    init() {
        const magneticElements = document.querySelectorAll('.btn-magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                    'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
                });
            }
        });

        // Monitor scroll performance
        let scrollCount = 0;
        window.addEventListener('scroll', () => {
            scrollCount++;
            if (scrollCount % 100 === 0) {
                console.log(`Scroll events processed: ${scrollCount}`);
            }
        });
    }
}

// Add custom CSS animations
const addCustomAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .animate-child {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
        }
        
        .animate-child.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add custom animations
    addCustomAnimations();
    
    // Initialize all managers
    new PreloaderManager();
    new CursorManager();
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new SkillsAnimator();
    new ContactFormHandler();
    new CVDownloadHandler();
    new BackToTopManager();
    new IntersectionAnimator();
    new MagneticEffects();
    new PerformanceMonitor();
    
    // Add page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('🚀 Enhanced Portfolio Loaded Successfully!');
});

// Handle window resize
window.addEventListener('resize', utils.debounce(() => {
    // Close mobile menu on resize
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (window.innerWidth > 768) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Reinitialize AOS on resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing animations');
    } else {
        console.log('Page visible - resuming animations');
    }
});

// Export for potential external use
window.PortfolioApp = {
    ThemeManager,
    NavigationManager,
    AnimationManager,
    ContactFormHandler,
    utils
};
