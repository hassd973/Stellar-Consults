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
      const isDarkMode = document.documentElement.classList.contains('dark');
      const colors = isDarkMode ? darkModeColors : lightModeColors;
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

  // Font Loading Error Detection
  const fontsToCheck = [
    { name: 'Humanoid', url: '/assets/fonts/Humanoid.ttf' },
    { name: 'NeueMetana-Bold', url: '/assets/fonts/NeueMetana-Bold.otf' },
    { name: 'NeueMetana-Regular', url: '/assets/fonts/NeueMetana-Regular.otf' },
    { name: 'Glitch', url: '/assets/fonts/glitch.ttf' }
  ];

  let fontsLoaded = 0;
  fontsToCheck.forEach(font => {
    const fontTest = new FontFace(font.name, `url(${font.url})`, { weight: font.name.includes('Bold') ? '700' : '400' });
    fontTest.load().then(() => {
      document.fonts.add(fontTest);
      fontsLoaded++;
      console.log(`Font ${font.name} loaded successfully from ${font.url}`);
    }).catch(err => {
      console.error(`Failed to load font ${font.name} from ${font.url}:`, err);
    });
  });

  // Fallback if fonts fail to load
  setTimeout(() => {
    if (fontsLoaded < fontsToCheck.length) {
      console.warn('Not all fonts loaded, applying JetBrains Mono fallback');
      document.querySelectorAll('h1, h2, h3').forEach(el => {
        el.style.fontFamily = "'JetBrains Mono', monospace";
      });
    }
  }, 3000);

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

  // Theme Toggle with Spline URL Switch
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') html.classList.add('dark');
  themeToggle.textContent = currentTheme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';

  const lightSplineUrl = 'https://prod.spline.design/QF93hExmWxJjAxAW/scene.splinecode';
  const darkSplineUrl = 'https://prod.spline.design/bPYHfwyVwULNcZok/scene.splinecode';

  // Set initial Spline URLs
  splineViewers.forEach((viewer, index) => {
    const url = currentTheme === 'light' ? lightSplineUrl : darkSplineUrl;
    viewer.setAttribute('url', url);
    console.log(`Initial Spline URL for viewer ${index + 1}:`, url);
    try {
      viewer.load();
    } catch (err) {
      console.error(`Viewer ${index + 1} failed to load initial URL:`, err);
    }
  });

  themeToggle.addEventListener('click', () => {
    try {
      const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
      html.classList.toggle('dark');
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';
      stars.forEach(star => star.updateColor());

      // Update Spline URLs
      const newUrl = newTheme === 'light' ? lightSplineUrl : darkSplineUrl;
      splineViewers.forEach((viewer, index) => {
        viewer.setAttribute('url', newUrl);
        try {
          viewer.load();
          console.log(`Viewer ${index + 1} URL updated to:`, newUrl);
        } catch (err) {
          console.error(`Viewer ${index + 1} failed to load URL ${newUrl}:`, err);
        }
      });

      console.log('Theme toggled to:', newTheme);
    } catch (err) {
      console.error('Theme toggle error:', err);
    }
  });

  // Scroll-based Overlay Color Transition
  function updateOverlayColor() {
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const purple = { r: 128, g: 0, b: 128 };
    const blue = { r: 0, g: 0, b: 255 };
    const r = Math.round(purple.r + (blue.r - purple.r) * scrollProgress);
    const b = Math.round(purple.b + (blue.b - purple.b) * scrollProgress);
    const newColor = `rgba(${r}, 0, ${b}, 0.5)`;
    document.documentElement.style.setProperty('--overlay-color', newColor);
    console.log('Overlay color updated:', newColor);
  }

  window.addEventListener('scroll', updateOverlayColor);
  updateOverlayColor(); // Initial call
});
