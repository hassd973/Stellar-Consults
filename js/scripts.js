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

  // Video Playback with Robust Fallback
  const video = document.querySelector('.video-background');
  const youtubeIframe = document.querySelector('.youtube-background');
  const fallbackImage = document.querySelector('.fallback-image');
  const videoSource = video.querySelector('source');
  let retryCount = 0;
  const maxRetries = 5;

  const debugVideo = () => {
    console.log('Video Debug Info:');
    console.log('Source:', videoSource.src);
    console.log('Video Element:', video);
    console.log('Current Retry Count:', retryCount);
    console.log('Network State:', video.networkState);
    console.log('Ready State:', video.readyState);
    console.log('Window Width:', window.innerWidth);
  };

  const tryVideoPlayback = () => {
    console.log(`Attempting to load video: ${videoSource.src}`);
    video.load();
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playback started successfully');
        })
        .catch((error) => {
          console.error('Video playback failed:', error);
          retryCount++;
          debugVideo();
          if (retryCount < maxRetries) {
            console.log(`Retrying video playback (${retryCount}/${maxRetries})`);
            setTimeout(tryVideoPlayback, 1000);
          } else {
            console.log('Switching to YouTube fallback');
            video.classList.add('hidden');
            youtubeIframe.classList.add('active');
            youtubeIframe.addEventListener('error', () => {
              console.error('YouTube iframe failed to load');
              youtubeIframe.classList.remove('active');
              fallbackImage.classList.add('active');
              console.log('Switched to fallback image');
            });
          }
        });
    }
  };

  video.addEventListener('error', (e) => {
    console.error('Video failed to load:', videoSource.src, e);
    retryCount++;
    debugVideo();
    if (retryCount < maxRetries) {
      console.log(`Retrying video load (${retryCount}/${maxRetries})`);
      setTimeout(tryVideoPlayback, 1000);
    } else {
      console.log('Switching to YouTube fallback');
      video.classList.add('hidden');
      youtubeIframe.classList.add('active');
    }
  });

  // Attempt to play video and debug
  debugVideo();
  tryVideoPlayback();

  // Mobile Video Fade
  const homeSection = document.querySelector('#home');
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.style.opacity = '0.9';
            youtubeIframe.style.opacity = '0.9';
            fallbackImage.style.opacity = '0.9';
          } else {
            video.style.opacity = '0';
            youtubeIframe.style.opacity = '0';
            fallbackImage.style.opacity = '0';
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(homeSection);
  }

  // Fade-in animation on scroll
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

  // Typewriter animation
  const typingText = document.querySelector('.typing-text');
  typingText.style.width = '0';
  setTimeout(() => {
    typingText.style.width = '100%';
    typingText.classList.add('cursor-blink');
  }, 100);

  // Services Section Interactivity
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isSelected = item.classList.contains('selected');
      serviceItems.forEach((i) => i.classList.remove('selected'));
      if (!isSelected) {
        item.classList.add('selected');
      }
    });
  });

  // Light/Dark Mode Toggle
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
  });
});
