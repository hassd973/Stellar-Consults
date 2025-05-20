document.addEventListener('DOMContentLoaded', () => {
  // Font cycle for typewriter effect
  const fonts = [
    'Courier Prime',
    'IBM Plex Mono',
    'VT323',
    'Source Code Pro'
  ];

  // Typewriter effect for all .typing-text elements
  const typingElements = document.querySelectorAll('.typing-text');
  typingElements.forEach(element => {
    const text = element.getAttribute('data-title');
    let fontIndex = parseInt(element.getAttribute('data-font-index')) || 0;

    function typeWriter(index = 0, typing = true) {
      if (typing) {
        // Typing forward
        if (index <= text.length) {
          element.textContent = text.slice(0, index);
          setTimeout(() => typeWriter(index + 1, true), 100);
        } else {
          // Pause after typing
          setTimeout(() => typeWriter(index, false), 500);
        }
      } else {
        // Backspacing
        if (index >= 0) {
          element.textContent = text.slice(0, index);
          setTimeout(() => typeWriter(index - 1, false), 50);
        } else {
          // Switch font and restart
          fontIndex = (fontIndex + 1) % fonts.length;
          element.setAttribute('data-font-index', fontIndex);
          element.className = `typing-text font-${fontIndex}`;
          setTimeout(() => typeWriter(0, true), 200);
        }
      }
    }

    // Start typewriter effect
    typeWriter();
  });

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    updateSplineViewers();
  });

  // Spline Viewer URLs
  const splineViewers = document.querySelectorAll('spline-viewer');
  const lightUrl = 'https://prod.spline.design/QF93hExmWxJjAxAW/scene.splinecode';
  const darkUrl = 'https://prod.spline.design/bPYHfwyVwULNcZok/scene.splinecode';

  function updateSplineViewers() {
    const isDark = body.classList.contains('dark');
    splineViewers.forEach((viewer, index) => {
      viewer.setAttribute('url', isDark ? darkUrl : lightUrl);
      console.log(`Viewer ${index + 1} URL updated to ${isDark ? 'dark' : 'light'} mode`);
    });
  }

  // Spline Error Handling
  splineViewers.forEach((viewer, index) => {
    viewer.addEventListener('error', () => {
      console.error(`Spline viewer ${index + 1} failed to load`);
      const fallback = viewer.parentElement.querySelector('.fallback-image');
      if (fallback) fallback.classList.remove('hidden');
    });
  });

  // Starfield Animation
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.5
      });
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = body.classList.contains('dark');
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      star.y += star.speed;
      if (star.y > canvas.height) star.y = 0;
    });
    requestAnimationFrame(animateStars);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateStars();

  // Date, Time, and Weather
  const dateTimeWeather = document.getElementById('datetime-weather');
  function updateDateTimeWeather() {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const dateTime = now.toLocaleString('en-US', options);
    const city = 'New York';
    const apiKey = 'YOUR_API_KEY';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        dateTimeWeather.textContent = `${dateTime} | ${city}, ${temp}°C, ${description}`;
      })
      .catch(error => {
        console.error('Weather API error:', error);
        dateTimeWeather.textContent = `${dateTime} | Weather unavailable`;
      });
  }
  updateDateTimeWeather();
  setInterval(updateDateTimeWeather, 60000);

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Fade-In Animation
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));

  // Interactive Elements
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      button.classList.add('clicked');
      setTimeout(() => button.classList.remove('clicked'), 200);
    });
  });

  // Text Bubble Popups
  const textBubbles = document.querySelectorAll('.text-bubble, .service-item, .success-item');
  textBubbles.forEach(bubble => {
    bubble.addEventListener('mouseenter', () => {
      const popup = bubble.querySelector('.bubble-popup');
      if (popup) {
        popup.classList.remove('hidden');
        console.log('Popup shown for', bubble.textContent);
      }
    });
    bubble.addEventListener('mouseleave', () => {
      const popup = bubble.querySelector('.bubble-popup');
      if (popup) popup.classList.add('hidden');
    });
    bubble.addEventListener('click', () => {
      const href = bubble.getAttribute('href') || bubble.querySelector('a')?.getAttribute('href');
      if (href) window.location.href = href;
    });
    bubble.addEventListener('keypress', e => {
      if (e.key === 'Enter') bubble.click();
    });
  });

  // Scroll-Based Overlay Adjustment
  const splineSections = document.querySelectorAll('#home, #subscribe, #spline-lower');
  window.addEventListener('scroll', () => {
    splineSections.forEach(section => {
      const overlay = section.querySelector('.spline-overlay');
      if (overlay) {
        const rect = section.getBoundingClientRect();
        const opacity = section.id === 'subscribe' ? 0.4 : 0.3;
        overlay.style.opacity = rect.top < window.innerHeight / 2 ? opacity + 0.2 : opacity;
        console.log(`${section.id} overlay opacity set to ${overlay.style.opacity}`);
      }
    });
  });

  // Leaflet Map
  const map = L.map('map').setView([40.7128, -74.0060], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.marker([40.7128, -74.0060]).addTo(map)
    .bindPopup('Stellar Consults<br>One World Trade Center')
    .openPopup();
});
