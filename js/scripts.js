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
      this.radius = Math.random() * 0.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.opacity = 0.7 + Math.random() * 0.3;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.pulseDirection = 1;
      this.updateColor();
    }

    updateColor() {
      const isDarkMode = document.body.classList.contains('dark');
      const colors = isDarkMode ? darkModeColors : lightModeColors;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      starfieldCtx.beginPath();
      starfieldCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      starfieldCtx.fillStyle = this.color;
      starfieldCtx.globalAlpha = this.opacity;
      starfieldCtx.shadowColor = this.color;
      starfieldCtx.shadowBlur = 10;
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

  // Font Loading Error Detection (Google Fonts)
  const fontsToCheck = [
    { name: 'Courier Prime', weight: '400' },
    { name: 'IBM Plex Mono', weight: '400' },
    { name: 'VT323', weight: '400' },
    { name: 'Source Code Pro', weight: '400' }
  ];

  let fontsLoaded = 0;
  fontsToCheck.forEach(font => {
    const fontTest = new FontFace(font.name, `url(https://fonts.googleapis.com/css2?family=${font.name.replace(' ', '+')}:wght@${font.weight})`, { weight: font.weight });
    fontTest.load().then(() => {
      document.fonts.add(fontTest);
      fontsLoaded++;
      console.log(`Font ${font.name} loaded successfully`);
    }).catch(err => {
      console.error(`Failed to load font ${font.name}:`, err);
    });
  });

  // Fallback if fonts fail to load
  setTimeout(() => {
    if (fontsLoaded < fontsToCheck.length) {
      console.warn('Not all fonts loaded, applying Source Code Pro fallback');
      document.querySelectorAll('h1, h2, h3').forEach(el => {
        el.style.fontFamily = "'Source Code Pro', monospace";
      });
    }
  }, 3000);

  // Spline Viewer Error Handling
  const splineViewers = document.querySelectorAll('spline-viewer');
  const fallbackImages = document.querySelectorAll('.fallback-image');
  const lightSplineUrl = 'https://prod.spline.design/QF93hExmWxJjAxAW/scene.splinecode';
  const darkSplineUrl = 'https://prod.spline.design/bPYHfwyVwULNcZok/scene.splinecode';

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

  // Spline Overlay Toggle
  document.querySelector('#spline-lower').addEventListener('mouseenter', () => {
    document.querySelector('#spline-lower .spline-overlay').style.opacity = '0.5';
    console.log('Spline-lower overlay: opacity set to 0.5');
  });
  document.querySelector('#spline-lower').addEventListener('mouseleave', () => {
    document.querySelector('#spline-lower .spline-overlay').style.opacity = '0.3';
    console.log('Spline-lower overlay: opacity set to 0.3');
  });

  document.querySelector('#subscribe').addEventListener('mouseenter', () => {
    document.querySelector('#subscribe .spline-overlay').style.opacity = '0.5';
    console.log('Subscribe overlay: opacity set to 0.5');
  });
  document.querySelector('#subscribe').addEventListener('mouseleave', () => {
    document.querySelector('#subscribe .spline-overlay').style.opacity = '0.3';
    console.log('Subscribe overlay: opacity set to 0.3');
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
      console.log('Interactive item clicked:', item.textContent);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const isSelected = item.classList.contains('selected');
        interactiveItems.forEach((i) => i.classList.remove('selected'));
        if (!isSelected) item.classList.add('selected');
        console.log('Interactive item selected via Enter:', item.textContent);
      }
    });
  });

  // Text Bubble and List Item Popups
  const popupItems = document.querySelectorAll('.text-bubble, .service-item, .success-item');
  popupItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const popup = item.querySelector('.bubble-popup');
      popup.classList.remove('hidden');
      console.log('Popup shown:', popup.textContent);
    });
    item.addEventListener('mouseleave', () => {
      const popup = item.querySelector('.bubble-popup');
      popup.classList.add('hidden');
      console.log('Popup hidden:', popup.textContent);
    });
  });

  // Button Click Feedback
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      button.classList.add('clicked');
      setTimeout(() => button.classList.remove('clicked'), 200);
      console.log('Button clicked:', button.textContent);
    });
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
      console.log('Smooth scroll to:', anchor.getAttribute('href'));
    });
  });

  // Theme Toggle with Spline URL Switch
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.body;
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') html.classList.add('dark');

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
      html.classList.toggle('dark');
      const newTheme = html.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
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

  // Hover-Based Font Cycling
  const fonts = [
    'font-0', // Courier Prime
    'font-1', // IBM Plex Mono
    'font-2', // VT323
    'font-3'  // Source Code Pro
  ];
  document.querySelectorAll('h2, h3').forEach(header => {
    header.addEventListener('mouseover', () => {
      let currentIndex = parseInt(header.getAttribute('data-font-index') || '0');
      let nextIndex = (currentIndex + 1) % fonts.length;
      header.style.opacity = '0';
      setTimeout(() => {
        header.className = header.className.replace(/font-\d/, fonts[nextIndex]);
        header.setAttribute('data-font-index', nextIndex);
        header.style.opacity = '1';
      }, 400);
    });
  });

  // Date/Time/Weather
  async function updateDateTimeWeather() {
    const datetimeEl = document.getElementById('datetime-weather');
    const now = new Date();
    const datetimeStr = now.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    try {
      const ipRes = await fetch('https://ipapi.co/json/');
      const { city } = await ipRes.json();
      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_API_KEY`);
      const { main: { temp }, weather } = await weatherRes.json();
      datetimeEl.textContent = `${datetimeStr} | ${city}, ${Math.round(temp)}°C, ${weather[0].description}`;
      console.log('Weather updated:', datetimeEl.textContent);
    } catch (e) {
      datetimeEl.textContent = `${datetimeStr} | New York, NY, 20°C, Partly Cloudy`;
      console.error('Weather fetch error:', e);
    }
  }
  updateDateTimeWeather();
  setInterval(updateDateTimeWeather, 60000);

  // Scroll-based Overlay Color Transition
  function updateOverlayColor() {
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const purple = { r: 139, g: 92, b: 246 }; // #8b5cf6
    const blue = { r: 59, g: 130, b: 246 };   // #3b82f6
    const r = Math.round(purple.r + (blue.r - purple.r) * scrollProgress);
    const g = Math.round(purple.g + (blue.g - purple.g) * scrollProgress);
    const b = Math.round(purple.b + (blue.b - purple.b) * scrollProgress);
    const newColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
    document.documentElement.style.setProperty('--overlay-color', newColor);
    document.querySelectorAll('.spline-overlay').forEach(el => {
      el.style.background = `linear-gradient(45deg, rgb(${r}, ${g}, ${b}), #3b82f6)`;
    });
    console.log('Overlay color updated:', newColor);
  }

  window.addEventListener('scroll', updateOverlayColor);
  updateOverlayColor();
});
