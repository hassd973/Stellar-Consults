document.addEventListener('DOMContentLoaded', () => {
  // Initialize Leaflet Map
  const map = L.map('map').setView([40.7128, -74.0060], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([40.7128, -74.0060])
    .addTo(map)
    .bindPopup('Stellar Consults<br>Servcorp One World Trade Center, 285 Fulton St Fl 85, New York, NY 10007')
    .openPopup();

  // Starfield Animation
  const starfieldCanvas = document.getElementById('starfield');
  const starfieldCtx = starfieldCanvas.getContext('2d');
  if (!starfieldCtx) {
    console.error('Starfield canvas context not supported');
    return;
  }
  starfieldCanvas.width = window.innerWidth;
  starfieldCanvas.height = window.innerHeight;
  console.log('Starfield initialized: width=', starfieldCanvas.width, 'height=', starfieldCanvas.height);

  const stars = [];
  const numStars = 50;
  const lightModeColors = ['#000000', '#333333', '#666666'];
  const darkModeColors = ['#FFFFFF', '#CCCCCC', '#999999'];

  class Star {
    constructor() {
      this.x = Math.random() * starfieldCanvas.width;
      this.y = Math.random() * starfieldCanvas.height;
      this.radius = Math.random() * 2 + 3;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.opacity = 0.7 + Math.random() * 0.3;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.pulseDirection = 1;
      this.updateColor();
    }

    updateColor() {
      const isLightMode = document.documentElement.classList.contains('light');
      const colors = isLightMode ? lightModeColors : darkModeColors;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      starfieldCtx.beginPath();
      starfieldCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      starfieldCtx.fillStyle = this.color;
      starfieldCtx.globalAlpha = this.opacity;
      starfieldCtx.shadowColor = this.color;
      starfieldCtx.shadowBlur = 20;
      starfieldCtx.fill();
      starfieldCtx.shadowBlur = 0;
      starfieldCtx.globalAlpha = 1;
      console.log('Drawing star: x=', this.x, 'y=', this.y, 'color=', this.color);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > starfieldCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > starfieldCanvas.height) this.vy *= -1;

      this.opacity += this.pulseSpeed * this.pulseDirection;
      if (this.opacity > 1 || this.opacity < 0.7) this.pulseDirection *= -1;
    }
  }

  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }

  function animateStars() {
    starfieldCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
    // Test canvas rendering
    starfieldCtx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    starfieldCtx.fillRect(0, 0, 100, 100);
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    console.log('Animating stars:', stars.length);
    requestAnimationFrame(animateStars);
  }

  // Check WebGL availability
  const gl = starfieldCanvas.getContext('webgl2') || starfieldCanvas.getContext('webgl');
  if (!gl) {
    console.warn('WebGL not supported, starfield and Spline may not render correctly');
  }

  animateStars();

  window.addEventListener('resize', () => {
    starfieldCanvas.width = window.innerWidth;
    starfieldCanvas.height = window.innerHeight;
    console.log('Starfield canvas resized: width=', starfieldCanvas.width, 'height=', starfieldCanvas.height);
    stars.forEach(star => {
      star.x = Math.random() * starfieldCanvas.width;
      star.y = Math.random() * starfieldCanvas.height;
    });
  });

  // Spline Viewer Error Handling (Home and Lower)
  const splineViewers = document.querySelectorAll('spline-viewer');
  const fallbackImages = document.querySelectorAll('.fallback-image');

  splineViewers.forEach((viewer, index) => {
    viewer.addEventListener('load', () => {
      console.log(`Spline viewer ${index + 1} loaded successfully`);
    });

    viewer.addEventListener('error', (e) => {
      console.error(`Spline viewer ${index + 1} error:`, e);
      viewer.style.display = 'none';
      fallbackImages[index].classList.remove('hidden');
      fallbackImages[index].classList.add('active');
      console.log(`Switched to image fallback for viewer ${index + 1}`);
    });

    // Fallback if Spline fails to load within 5 seconds
    setTimeout(() => {
      if (!viewer.shadowRoot || !viewer.shadowRoot.querySelector('canvas')) {
        console.warn(`Spline viewer ${index + 1} failed to initialize within 5 seconds`);
        viewer.style.display = 'none';
        fallbackImages[index].classList.remove('hidden');
        fallbackImages[index].classList.add('active');
        console.log(`Switched to image fallback for viewer ${index + 1}`);
      }
    }, 5000);
  });

  // Dynamic Nav Padding
  const nav = document.querySelector('nav');
  const homeSection = document.querySelector('#home');
  function updateHomePadding() {
    const navHeight = nav.getBoundingClientRect().height;
    homeSection.style.paddingTop = `${navHeight + 20}px`;
    console.log('Nav height:', navHeight, 'Home padding-top:', homeSection.style.paddingTop);
  }
  updateHomePadding();
  window.addEventListener('resize', updateHomePadding);

  // Fade-in Animation
  const sections = document.querySelectorAll('.fade-in');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  // Typewriter Animation
  const typingText = document.querySelector('.typing-text');
  typingText.style.width = '0';
  setTimeout(() => {
    typingText.style.width = '100%';
    typingText.classList.add('cursor-blink');
  }, 100);

  // Interactive Items
  const interactiveItems = document.querySelectorAll('.service-item, .success-item, .team-item, .resource-item');
  interactiveItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isSelected = item.classList.contains('selected');
      interactiveItems.forEach((i) => i.classList.remove('selected'));
      if (!isSelected) item.classList.add('selected');
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const isSelected = item.classList.contains('selected');
        interactiveItems.forEach((i) => i.classList.remove('selected'));
        if (!isSelected) item.classList.add('selected');
      }
    });
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.classList.add(currentTheme);
  themeToggle.textContent = currentTheme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';

  themeToggle.addEventListener('click', () => {
    const newTheme = html.classList.contains('light') ? 'dark' : 'light';
    html.classList.remove('light', 'dark');
    html.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';
    stars.forEach(star => star.updateColor());
    console.log('Theme switched to:', newTheme);
  });
});
