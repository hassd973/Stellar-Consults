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

  // Fade-in animation on scroll
  const sections = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));

  // Trigger typing animation for hero title
  const typingText = document.querySelector('.typing-text');
  typingText.style.width = '0';
  setTimeout(() => {
    typingText.style.width = '100%';
  }, 100);
});

// Load custom font
function loadCustomFont(event) {
  const file = event.target.files[0];
  if (!file || !file.name.match(/\.(ttf|woff|woff2)$/)) {
    alert('Please upload a valid font file (.ttf, .woff, or .woff2).');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const fontData = e.target.result;
    const fontFace = new FontFace('Neue Metana', `url(${fontData})`);
    fontFace.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      document.body.style.fontFamily = "'Neue Metana', 'Nunito Sans', sans-serif";
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(`
        h1, h2, h3 {
          font-family: 'Neue Metana', 'Nunito Sans', sans-serif;
          font-weight: 600;
        }
      `, styleSheet.cssRules.length);
    }).catch((error) => {
      console.error('Error loading font:', error);
      alert('Failed to load the font. Please try again.');
    });
  };
  reader.readAsDataURL(file);
}

// Load custom video
function loadCustomVideo(event) {
  const file = event.target.files[0];
  if (!file || !file.name.match(/\.mp4$/)) {
    alert('Please upload a valid video file (.mp4).');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const videoData = e.target.result;
    const videoSource = document.getElementById('video-source');
    const videoElement = document.querySelector('.video-background');
    videoSource.src = videoData;
    videoElement.load();
    videoElement.play().catch((error) => {
      console.error('Error playing video:', error);
      alert('Failed to play the video. Please try again.');
    });
  };
  reader.readAsDataURL(file);
}