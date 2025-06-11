const circle = document.getElementById('circle');
const audio = document.getElementById('audio');
const toggleBtn = document.getElementById('toggleBtn');
const volumeSlider = document.getElementById('volumeSlider');
const themeToggle = document.getElementById('themeToggle');
const effectToggle = document.getElementById('effectToggle');
const canvas = document.getElementById('effectCanvas');
const snowCanvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
const snowCtx = snowCanvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
snowCanvas.width = window.innerWidth;
snowCanvas.height = window.innerHeight;

let audioCtx, src, analyser, dataArray, bufferLength;
let playing = false;


function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    src = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    animate();
  }
}

toggleBtn.onclick = () => {
  if (!playing) {
    const confirmPlay = confirm("⚠️ Bạn phải xác nhận để nghe nhạc. Tiếp tục?");
    if (confirmPlay) {
      initAudio();
      audio.play();
      toggleBtn.textContent = '🔊 On';
      playing = true;
    }
  } else {
    audio.pause();
    toggleBtn.textContent = '🔇 Off';
    playing = false;
  }
};

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light') ? '🌞 Light Mode' : '🌙 Dark Mode';
});

effectToggle.addEventListener('click', () => {
  effectsEnabled = !effectsEnabled;
  effectToggle.textContent = effectsEnabled ? '✨ Bật Hiệu Ứng' : '🚫 Tắt Hiệu Ứng';
});

document.body.addEventListener('click', (e) => {
  if (!effectsEnabled) return;
  let size = 0;
  const maxSize = 30;
  const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
  const draw = () => {
    ctx.beginPath();
    ctx.arc(e.clientX, e.clientY, size, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.stroke();
    size += 1;
    if (size < maxSize) requestAnimationFrame(draw);
  };
  draw();
});

function animate() {
  requestAnimationFrame(animate);
  if (!playing || !analyser) return;
  analyser.getByteFrequencyData(dataArray);
  const intensity = dataArray[10];
  let scale = 1 + intensity / 128;
  const hue = Math.floor(intensity * 2);
  circle.style.transform = `scale(${scale})`;
  circle.style.borderColor = `hsl(${hue}, 100%, 50%)`;
  circle.style.boxShadow = `0 0 20px hsl(${hue}, 100%, 50%)`;
}

// Tuyết rơi động
let snowflakes = Array.from({ length: 100 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 3 + 1,
  d: Math.random() * 1 + 0.5
}));

function drawSnow() {
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowCtx.fillStyle = 'white';
  snowCtx.beginPath();
  snowflakes.forEach(flake => {
    snowCtx.moveTo(flake.x, flake.y);
    snowCtx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
  });
  snowCtx.fill();
  moveSnow();
  requestAnimationFrame(drawSnow);
}

function moveSnow() {
  snowflakes.forEach(flake => {
    flake.y += flake.d;
    if (flake.y > window.innerHeight) {
      flake.y = 0;
      flake.x = Math.random() * window.innerWidth;
    }
  });
}

drawSnow();
