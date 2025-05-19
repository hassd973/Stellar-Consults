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

  // Starfield Animation (Landing Page Only)
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  const numStars = 40;
  const lightModeColors = ['#000000', '#4A4A4A', '#7A7A7A', '#B3B3B3'];
  const darkModeColors = ['#FFFFFF', '#4A4A4A', '#7A7A7A', '#B3B3B3'];

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 1.3 + 0.7;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.opacity = 0.7 + Math.random() * 0.3;
      this.pulseSpeed = 0.015 + Math.random() * 0.025;
      this.pulseDirection = 1;
      this.updateColor();
    }

    updateColor() {
      const isLightMode = document.documentElement.classList.contains('light');
      const colors = isLightMode ? lightModeColors : darkModeColors;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      this.opacity += this.pulseSpeed * this.pulseDirection;
      if (this.opacity > 1 || this.opacity < 0.7) this.pulseDirection *= -1;
    }
  }

  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    requestAnimationFrame(animateStars);
  }

  animateStars();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Video Playback
  const video = document.querySelector('.video-background');
  const youtubeIframe = document.querySelector('.youtube-background');
  const fallbackImage = document.querySelector('.fallback-image');
  const videoSource = video.querySelector('source');

  const debugVideo = () => {
    console.log('Video Debug Info:');
    console.log('Source:', videoSource.src);
    console.log('Muted:', video.muted);
    console.log('Autoplay:', video.autoplay);
    console.log('Loop:', video.loop);
    console.log('Playsinline:', video.playsInline);
    console.log('Network State:', video.networkState);
    console.log('Ready State:', video.readyState);
    console.log('Error:', video.error ? video.error.message : 'None');
  };

  const tryVideoPlayback = () => {
    console.log(`Attempting to play video: ${videoSource.src}`);
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.load();
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => console.log('Video started successfully'))
        .catch((error) => {
          console.error('Video playback failed:', error.message);
          debugVideo();
          console.log('Switching to YouTube fallback');
          video.classList.add('hidden');
          youtubeIframe.classList.add('active');
          youtubeIframe.addEventListener('error', () => {
            console.error('YouTube iframe failed');
            youtubeIframe.classList.remove('active');
            fallbackImage.classList.add('active');
          }, { once: true });
        });
    }
  };

  // User Interaction Fallback
  const playVideoOnInteraction = () => {
    if (video.paused) {
      console.log('Retrying video playback on user interaction');
      tryVideoPlayback();
    }
  };

  // Add multiple interaction events for mobile
  document.addEventListener('click', playVideoOnInteraction);
  document.addEventListener('touchstart', playVideoOnInteraction);
  document.addEventListener('scroll', playVideoOnInteraction, { once: true });

  video.addEventListener('error', (e) => {
    console.error('Video error:', videoSource.src, e);
    debugVideo();
    video.classList.add('hidden');
    youtubeIframe.classList.add('active');
  });

  video.addEventListener('ended', () => {
    console.log('Video ended, restarting');
    video.play();
  });

  // Retry playback after 1s if initial attempt fails
  setTimeout(() => {
    if (video.paused) {
      console.log('Initial playback failed, retrying...');
      tryVideoPlayback();
    }
  }, 1000);

  debugVideo();
  tryVideoPlayback();

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
    // Update star colors on theme change
    stars.forEach(star => star.updateColor());
  });
});
