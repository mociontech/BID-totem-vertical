(() => {
  'use strict';
  const el = Object.fromEntries(['home', 'player', 'video', 'introFrame', 'surface', 'instructions', 'controls', 'timeline', 'progress', 'point', 'seek', 'notice'].map(id => [id, document.getElementById(id)]));
  const INTRO_MS = 7000;
  let phase = 'home';
  let introTimer;
  let session = 0;
  let frame;

  function syncPlaybackControl() {
    const button = el.controls.querySelector('[data-action="toggle"]');
    const playing = !el.video.paused && !el.video.ended;
    button.dataset.playing = String(playing);
    button.setAttribute('aria-label', playing ? 'Pausar video' : 'Reproducir video');
  }

  function showControls(visible) {
    el.controls.hidden = el.timeline.hidden = !visible;
    el.surface.setAttribute('aria-label', visible ? 'Ocultar controles' : 'Mostrar controles');
  }
  function updateProgress() {
    const duration = el.video.duration;
    // During instructions, demonstrate both halves without changing the video position.
    const ratio = phase === 'intro' ? 0.5 : (Number.isFinite(duration) && duration > 0 ? Math.min(1, el.video.currentTime / duration) : 0);
    el.progress.style.width = el.point.style.left = `${ratio * 100}%`;
    el.seek.value = Math.round(ratio * 1000);
    el.seek.setAttribute('aria-valuetext', `${Math.floor(el.video.currentTime)} de ${Number.isFinite(duration) ? Math.floor(duration) : 0} segundos`);
  }
  function tick() {
    updateProgress();
    if (phase === 'playing' && !el.video.paused) frame = requestAnimationFrame(tick);
  }
  function setNotice(message) {
    el.notice.textContent = message;
    el.notice.hidden = !message;
  }
  async function play() {
    if (phase !== 'playing') return;
    const activeSession = session;
    setNotice('');
    try { await el.video.play(); }
    catch {
      if (session === activeSession && phase === 'playing') {
        showControls(true);
        setNotice(el.video.error ? 'No se pudo cargar el video. Comprueba Images/Video.mp4.' : 'Toca aquí para reproducir el video.');
      }
    }
  }
  function returnHome() {
    session++;
    clearTimeout(introTimer);
    cancelAnimationFrame(frame);
    phase = 'home';
    el.video.pause();
    el.video.currentTime = 0;
    syncPlaybackControl();
    el.player.hidden = true;
    el.home.hidden = false;
    el.instructions.hidden = true;
    el.introFrame.hidden = true;
    [el.instructions, el.controls, el.timeline].forEach(item => item.classList.remove('breathe'));
    setNotice('');
    showControls(false);
    updateProgress();
  }
  function start() {
    if (phase !== 'home') return;
    phase = 'intro';
    session++;
    el.home.hidden = true;
    el.player.hidden = false;
    el.video.pause();
    el.video.currentTime = 0;
    syncPlaybackControl();
    el.instructions.hidden = false;
    el.introFrame.hidden = false;
    updateProgress();
    showControls(true);
    el.controls.inert = el.timeline.inert = true;
    [el.instructions, el.controls, el.timeline].forEach(item => item.classList.add('breathe'));
    introTimer = setTimeout(() => {
      phase = 'playing';
      el.instructions.hidden = true;
      el.introFrame.hidden = true;
      updateProgress();
      [el.instructions, el.controls, el.timeline].forEach(item => item.classList.remove('breathe'));
      el.controls.inert = el.timeline.inert = false;
      showControls(false);
      play();
    }, INTRO_MS);
  }
  function seekTo(seconds) {
    if (phase !== 'playing' || !Number.isFinite(el.video.duration)) return;
    el.video.currentTime = Math.max(0, Math.min(el.video.duration, seconds));
    updateProgress();
  }
  el.home.addEventListener('click', start);
  // Explicit pointer feedback also works on touchscreens while holding a button.
  el.controls.querySelectorAll('button').forEach(button => {
    const release = () => button.classList.remove('is-pressed');
    button.addEventListener('pointerdown', event => {
      if (phase !== 'playing' || event.button !== 0) return;
      button.classList.add('is-pressed');
    });
    ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(type => button.addEventListener(type, release));
    window.addEventListener('blur', release);
  });
  el.surface.addEventListener('click', () => {
    if (phase === 'playing') showControls(el.controls.hidden);
  });
  el.controls.addEventListener('click', event => {
    if (phase !== 'playing') return;
    switch (event.target.dataset.action) {
      case 'restart': seekTo(0); play(); break;
      case 'back': seekTo(el.video.currentTime - 10); break;
      case 'toggle': el.video.paused ? play() : el.video.pause(); break;
      case 'forward': seekTo(el.video.currentTime + 10); break;
      case 'home': returnHome(); break;
    }
  });
  el.seek.addEventListener('input', () => seekTo(Number(el.seek.value) / 1000 * el.video.duration));
  el.notice.addEventListener('click', () => { if (el.video.error) el.video.load(); play(); });
  el.video.addEventListener('ended', returnHome);
  el.video.addEventListener('timeupdate', updateProgress);
  el.video.addEventListener('loadedmetadata', updateProgress);
  el.video.addEventListener('play', () => {
    if (phase !== 'playing') { el.video.pause(); return; }
    cancelAnimationFrame(frame);
    tick();
    syncPlaybackControl();
  });
  el.video.addEventListener('pause', () => {
    cancelAnimationFrame(frame);
    syncPlaybackControl();
  });
  el.video.addEventListener('error', () => {
    if (phase === 'playing') { showControls(true); setNotice('No se pudo cargar el video. Comprueba Images/Video.mp4.'); }
  });
})();
