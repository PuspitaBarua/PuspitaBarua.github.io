// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        
        this.init();
    }
    
    init() {
        this.setTheme(this.theme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
        } else {
            this.themeIcon.className = 'fas fa-moon';
        }
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Active link highlighting
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Smooth scrolling
        this.setupSmoothScrolling();
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Skills Animation
class SkillsAnimator {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.animated = false;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.checkSkillsSection());
    }
    
    checkSkillsSection() {
        if (this.animated) return;
        
        const skillsSection = document.getElementById('skills');
        const sectionTop = skillsSection.offsetTop;
        const sectionHeight = skillsSection.offsetHeight;
        const scrollPos = window.scrollY + window.innerHeight;
        
        if (scrollPos >= sectionTop + sectionHeight / 2) {
            this.animateSkills();
            this.animated = true;
        }
    }
    
    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            }, index * 200);
        });
    }
}

// Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        this.showNotification('Message sent successfully!', 'success');
        this.form.reset();
        
        // In a real application, you would send the data to your server
        console.log('Form data:', data);
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// CV Download Handler
class CVDownloadHandler {
    constructor() {
        this.downloadButtons = document.querySelectorAll('#download-cv, #footer-cv');
        this.init();
    }
    
    init() {
        this.downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleDownload(e));
        });
    }
    
    handleDownload(e) {
        e.preventDefault();
        
        // Create a simple CV content (in a real application, you would have an actual PDF file)
        const cvContent = this.generateCVContent();
        const blob = new Blob([cvContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Puspita_Barua_CV.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showDownloadNotification();
    }
    
    generateCVContent() {
        return `
PUSPITA BARUA
Electronics & Telecommunication Engineering Student
Chittagong University of Engineering & Technology (CUET)

CONTACT INFORMATION
Email: puspitabarua24.ctg@gmail.com
Location: Chittagong, Bangladesh
GitHub: https://github.com/PuspitaBarua

EDUCATION
Bachelor of Science - Electronics & Telecommunication Engineering
Chittagong University of Engineering & Technology (CUET)
Level 3, Term 2 (Ongoing)

Higher Secondary Certificate (HSC) - Science Group
Chittagong College
Year: 2021 | GPA: 5.00

Secondary School Certificate (SSC) - Science Group
Chittagong Engineering University School & College
Year: 2019 | GPA: 5.00

TECHNICAL SKILLS
Programming Languages: C, C++, Python, Java, PHP
Web Technologies: HTML, CSS, JavaScript, MySQL
Software & Tools: MATLAB, Proteus, ADS
Hardware & Embedded: Arduino, Microcontroller, Circuit Design

RESEARCH INTERESTS
- Communication Systems
- Internet of Things (IoT)
- Digital Signal Processing

FEATURED PROJECTS
1. Smart Guard: Hybrid Authentication Door Lock
   - Digital Logic Design project
   - Multiple authentication methods with solenoid mechanism

2. ASK Modulation & Demodulation System
   - Digital Communication project
   - Amplitude Shift Keying implementation and analysis

3. Cookistry - Food Recipe Platform
   - Web development project using PHP and MySQL
   - Full-stack recipe management platform

ABOUT
As an Electronics & Telecommunication Engineering student at CUET, I'm driven by the fascinating world where digital innovation meets real-world applications. My journey in technology began with curiosity about how devices communicate and has evolved into a passion for creating intelligent systems that bridge the gap between theoretical concepts and practical solutions.
        `.trim();
    }
    
    showDownloadNotification() {
        const notification = document.createElement('div');
        notification.textContent = 'CV downloaded successfully!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: #10B981;
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Intersection Observer for animations
class AnimationObserver {
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
                }
            });
        }, this.observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .stat-item');
        animateElements.forEach(el => observer.observe(el));
    }
}

// Add CSS animations
const animationStyles = `
    <style>
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .timeline-item,
        .skill-category,
        .project-card,
        .stat-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .timeline-item.animate,
        .skill-category.animate,
        .project-card.animate,
        .stat-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-category.animate {
            transition-delay: 0.1s;
        }
        
        .project-card.animate {
            transition-delay: 0.2s;
        }
    </style>
`;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add animation styles
    document.head.insertAdjacentHTML('beforeend', animationStyles);
    
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new SkillsAnimator();
    new ContactFormHandler();
    new CVDownloadHandler();
    new AnimationObserver();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Preloader (optional)
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
    // Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add animation styles
    document.head.insertAdjacentHTML('beforeend', animationStyles);
    
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new SkillsAnimator();
    new ContactFormHandler();
    new AnimationObserver();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

});
