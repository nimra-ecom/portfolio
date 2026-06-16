document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars-staggered');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars-staggered');
            }
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars-staggered');
            });
        });
    }

    // Header Scroll behavior
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // STATS COUNT UP ANIMATION
    // ==========================================================================
    const statsNumbers = document.querySelectorAll('.stat-number');
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 15);
        
        const timer = setInterval(() => {
            count += Math.ceil(target / (duration / stepTime));
            if (count >= target) {
                element.innerText = target;
                clearInterval(timer);
            } else {
                element.innerText = count;
            }
        }, stepTime);
    };

    // Intersection Observer for stats
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statsNumbers.forEach(num => countUp(num));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // ==========================================================================
    // INTERACTIVE MATH PARTICLES CANVAS (Dark Purple & Gold on Light Background)
    // ==========================================================================
    const canvas = document.getElementById('math-particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 60;
        const mathSymbols = ['x', 'y', '+', '=', '%', 'π', '∑', '∫', 'Δ', 'θ'];

        // Resize Canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
                // 15% chance to be a math character instead of a dot
                this.isMath = Math.random() < 0.15;
                this.symbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
                this.alpha = Math.random() * 0.4 + 0.15;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                
                if (this.isMath) {
                    ctx.font = '11px Courier New';
                    ctx.fillStyle = '#b8860b'; // Dark Gold for contrast on white
                    ctx.fillText(this.symbol, this.x, this.y);
                } else {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = '#8e44ad'; // Purple for contrast on white
                    ctx.fill();
                }
                ctx.restore();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        // Connecting lines (nodes)
        const drawConnections = () => {
            let maxDistance = 120;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        // Make line color fade as distance increases (using dark purple line webbing)
                        let alpha = (1 - (dist / maxDistance)) * 0.08;
                        ctx.strokeStyle = `rgba(29, 10, 58, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ==========================================================================
    // ROI CALCULATOR LOGIC
    // ==========================================================================
    const rangeSpend = document.getElementById('range-spend');
    const rangeConversion = document.getElementById('range-conversion');
    const rangeAov = document.getElementById('range-aov');
    const rangeRoas = document.getElementById('range-roas');

    const valSpend = document.getElementById('val-spend');
    const valConversion = document.getElementById('val-conversion');
    const valAov = document.getElementById('val-aov');
    const valRoas = document.getElementById('val-roas');

    const resRevenue = document.getElementById('res-revenue');
    const resProfit = document.getElementById('res-profit');
    const resOrders = document.getElementById('res-orders');
    const resLift = document.getElementById('res-lift');

    const roiStatus = document.getElementById('roi-status');
    const roiProgressBar = document.getElementById('roi-progress');

    const updateCalculator = () => {
        // Fetch raw values
        const spend = parseFloat(rangeSpend.value);
        const conversion = parseFloat(rangeConversion.value);
        const aov = parseFloat(rangeAov.value);
        const roas = parseFloat(rangeRoas.value);

        // Update Slider Labels
        valSpend.innerText = `$${spend.toLocaleString()}`;
        valConversion.innerText = `${conversion.toFixed(1)}%`;
        valAov.innerText = `$${aov}`;
        valRoas.innerText = `${roas.toFixed(1)}x`;

        // Calculate Projections
        const revenue = spend * roas;
        const profit = revenue - spend;
        const orders = Math.round(revenue / aov);
        
        // Base Shopify store CR averages 1.5%
        const baseCR = 1.5;
        let lift = 0;
        if (conversion > baseCR) {
            lift = ((conversion - baseCR) / baseCR) * 100;
        }

        // Display results
        resRevenue.innerText = `$${Math.round(revenue).toLocaleString()}`;
        resProfit.innerText = `$${Math.round(profit).toLocaleString()}`;
        resOrders.innerText = orders.toLocaleString();
        resLift.innerText = lift > 0 ? `+${lift.toFixed(0)}%` : '+0%';

        // ROAS status labels & Progress meter bar
        let statusText = "Break-Even (1.0x)";
        let progressWidth = 10; // min 10%
        
        if (roas < 1.5) {
            statusText = `At Risk (${roas.toFixed(1)}x)`;
            progressWidth = 15;
            roiStatus.className = 'purple-light-text';
        } else if (roas < 2.5) {
            statusText = `Healthy Return (${roas.toFixed(1)}x)`;
            progressWidth = 40;
            roiStatus.className = 'gold-text';
        } else if (roas < 4.0) {
            statusText = `High Yield Performance (${roas.toFixed(1)}x)`;
            progressWidth = 70;
            roiStatus.className = 'green-text';
        } else {
            statusText = `Explosive Brand Scale (${roas.toFixed(1)}x)`;
            progressWidth = 100;
            roiStatus.className = 'green-text font-bold';
        }

        roiStatus.innerText = statusText;
        roiProgressBar.style.width = `${progressWidth}%`;
    };

    // Attach listeners
    if (rangeSpend && rangeConversion && rangeAov && rangeRoas) {
        [rangeSpend, rangeConversion, rangeAov, rangeRoas].forEach(slider => {
            slider.addEventListener('input', updateCalculator);
        });
        // Run first calculation
        updateCalculator();
    }

    // ==========================================================================
    // SERVICES SELECTION & PRE-FILL
    // ==========================================================================
    const serviceButtons = document.querySelectorAll('.service-btn');
    const contactCheckboxes = document.querySelectorAll('input[name="service-needed"]');
    const contactSection = document.getElementById('contact');

    serviceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = btn.getAttribute('data-service');
            
            // Uncheck all checkboxes first
            contactCheckboxes.forEach(cb => cb.checked = false);
            
            // Find and check the matching checkbox
            const matchingCheckbox = Array.from(contactCheckboxes).find(cb => cb.value === serviceName);
            if (matchingCheckbox) {
                matchingCheckbox.checked = true;
            }

            // Smooth scroll to contact section
            contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // BUDGET SLIDER FOR CONTACT FORM
    // ==========================================================================
    const formBudget = document.getElementById('form-budget');
    const formBudgetVal = document.getElementById('form-budget-val');

    if (formBudget && formBudgetVal) {
        formBudget.addEventListener('input', () => {
            const budgetVal = parseInt(formBudget.value, 10);
            let budgetText;
            if (budgetVal <= 5) {
                budgetText = 'Under $5';
            } else if (budgetVal < 50) {
                budgetText = `$${budgetVal}`;
            } else if (budgetVal >= 15000) {
                budgetText = '$15,000+ (Enterprise)';
            } else {
                const lower = Math.floor(budgetVal / 500) * 500;
                const upper = lower + 1500;
                budgetText = `$${lower.toLocaleString()} - $${upper.toLocaleString()}`;
            }
            formBudgetVal.innerText = budgetText;
        });
    }

    // ==========================================================================
    // CONTACT FORM & SUCCESS MODAL
    // ==========================================================================
    const projectForm = document.getElementById('project-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    const confirmService = document.getElementById('modal-service-confirm');
    const confirmBudget = document.getElementById('modal-budget-confirm');

    if (projectForm && successModal && closeModalBtn) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather selected services
            const selectedServices = Array.from(contactCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            const serviceDisplay = selectedServices.length > 0 
                ? selectedServices.join(', ') 
                : 'General Scale Strategy Consultation';
            
            // Budget selected
            const budgetVal = formBudgetVal.innerText;

            // Fill Modal text
            confirmService.innerText = serviceDisplay;
            confirmBudget.innerText = budgetVal;

            // Open Modal
            successModal.classList.add('active');

            // Reset form
            projectForm.reset();
            if (formBudget) {
                formBudget.value = 0;
                formBudgetVal.innerText = 'Under $5';
            }
        });

        // Close Modal
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });

        // Close on clicking overlay
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }
    // ==========================================================================
    // MINI-BAR STATS ANIMATION (Hero Dashboard)
    // ==========================================================================
    const miniBarGreen = document.querySelector('.mini-bar.green-bar');
    const miniBarGold = document.querySelector('.mini-bar.gold-bar');
    setTimeout(() => {
        if (miniBarGreen) miniBarGreen.style.transition = 'width 2s cubic-bezier(0.22, 1, 0.36, 1)';
        if (miniBarGold) miniBarGold.style.transition = 'width 2.3s cubic-bezier(0.22, 1, 0.36, 1)';
        // Animate from 0 to their target width
        if (miniBarGreen) { miniBarGreen.style.width = '0%'; }
        if (miniBarGold) { miniBarGold.style.width = '0%'; }
        setTimeout(() => {
            if (miniBarGreen) miniBarGreen.style.width = '80%';
            if (miniBarGold) miniBarGold.style.width = '75%';
        }, 400);
    }, 600);

    // ==========================================================================
    // CLIENT REVIEWS - DUAL ROW INJECTION
    // ==========================================================================
    const clientReviews = [
        {
            stars: '★★★★★',
            text: 'Nimra set up our entire Shopify store from scratch. The design is clean, mobile-friendly, and our checkout flow is seamless. Conversions improved significantly within the first week!',
            name: 'Sarah Mitchell',
            country: '🇺🇸 United States',
            service: 'Shopify Store Setup'
        },
        {
            stars: '★★★★★',
            text: 'The Meta Ads campaign she managed for us was exceptional. ROAS hit 4.8x within 20 days! Her data-driven approach and targeting strategy are unlike anything I have experienced.',
            name: 'Omar Al-Rashid',
            country: '🇦🇪 UAE',
            service: 'Meta Ads Management'
        },
        {
            stars: '★★★★★',
            text: 'Nimra redesigned our entire brand identity and the result was stunning. The social media posts she designed drove massive engagement. Very professional and responsive throughout!',
            name: 'Priya Sharma',
            country: '🇮🇳 India',
            service: 'Brand Visual Refresh'
        },
        {
            stars: '★★★★★',
            text: 'Our Shopify store needed custom Liquid code for an upsell popup. Nimra delivered it perfectly — app-less, fast, and exactly what we envisioned. Highly skilled developer!',
            name: 'Jake Thompson',
            country: '🇬🇧 United Kingdom',
            service: 'Custom Liquid Development'
        },
        {
            stars: '★★★★★',
            text: 'Excellent attention to detail. The ad copies she wrote had incredible hooks — our CTR went up by 65% and our cost-per-click dropped by 40%. A true performance marketer!',
            name: 'Chen Wei',
            country: '🇨🇦 Canada',
            service: 'Ad Copy & SEO'
        },
        {
            stars: '★★★★★',
            text: 'Nimra handled our entire Meta Ads funnel. The structured audience targeting and lookalike setup was top-notch. We saw 3.5x ROAS on a cold audience — simply amazing!',
            name: 'Fatima Al-Zahra',
            country: '🇸🇦 Saudi Arabia',
            service: 'Meta Ads Management'
        },
        {
            stars: '★★★★★',
            text: 'We hired Nimra for a brand refresh and social media post designs. Every post was cohesive, on-brand, and engaging. Our Instagram reach doubled after launching the new designs.',
            name: 'Lucas Müller',
            country: '🇩🇪 Germany',
            service: 'Social Media Design'
        },
        {
            stars: '★★★★★',
            text: 'Fast turnaround, clear communication, and professional delivery. Nimra revamped our Shopify navigation and homepage and our bounce rate dropped by 30%. Absolutely recommend!',
            name: 'Aisha Karimi',
            country: '🇵🇰 Pakistan',
            service: 'Shopify UX Optimization'
        },
        {
            stars: '★★★★★',
            text: 'The ROI on working with Nimra was incredible. She set up our entire Facebook and Instagram ad account, wrote all ad copy, and we saw profitable results in the very first month.',
            name: 'Carlos Mendez',
            country: '🇲🇽 Mexico',
            service: 'Meta Ads Management'
        },
        {
            stars: '★★★★★',
            text: 'Nimra created product descriptions and SEO copy for our store and the improvement was immediate. Very detail-oriented, understands e-commerce deeply, and delivers ahead of schedule.',
            name: 'Yuki Tanaka',
            country: '🇯🇵 Japan',
            service: 'Product Listings & SEO'
        }
    ];

    function buildReviewCard(review) {
        const initials = review.name.split(' ').map(n => n[0]).join('');
        return `
        <div class="client-review-card">
            <span class="service-tag-mini">${review.service}</span>
            <div class="stars">${review.stars}</div>
            <p class="review-text">"${review.text}"</p>
            <div class="review-footer">
                <div class="review-avatar">${initials}</div>
                <div class="review-client-info">
                    <h5>${review.name}</h5>
                    <span class="country">${review.country}</span>
                </div>
            </div>
        </div>`;
    }

    const row1 = document.getElementById('reviews-row-1');
    const row2 = document.getElementById('reviews-row-2');

    if (row1 && row2) {
        const firstHalf = clientReviews.slice(0, 5);
        const secondHalf = clientReviews.slice(5);

        // Duplicate for seamless infinite loop
        const row1HTML = [...firstHalf, ...firstHalf].map(buildReviewCard).join('');
        const row2HTML = [...secondHalf, ...secondHalf].map(buildReviewCard).join('');

        row1.innerHTML = row1HTML;
        row2.innerHTML = row2HTML;
    }
});
