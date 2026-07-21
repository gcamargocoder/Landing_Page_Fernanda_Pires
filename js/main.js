/* =========================================================
   main.js — Header scroll, mobile nav, reveal on scroll
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // Ícones Lucide
  if (window.lucide) lucide.createIcons();

  // Ano atual no rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Palavra giratória no título do Hero
  const rotatorEl = document.getElementById('heroRotator');
  if (rotatorEl){
    const words = ['ansiedade', 'pânico', 'medos', 'traumas', 'dores'];
    let wordIndex = 0;

    setInterval(() => {
      rotatorEl.classList.add('is-fading');

      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        rotatorEl.textContent = words[wordIndex];
        rotatorEl.classList.remove('is-fading');
      }, 300);
    }, 2600);
  }

  // Header muda de estilo ao rolar
  const header = document.getElementById('header');
  if (header){
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
  }

  // Menu mobile
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  if (nav && navToggle){
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', false);
        navToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  // Reveal on scroll — repete toda vez que o elemento entra ou sai da tela
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.2 });

  revealEls.forEach(el => observer.observe(el));

  // Slider de depoimentos
  const track = document.getElementById('depoimentosTrack');
  if (track){
    const slides = Array.from(track.children);
    const dotsWrap = document.getElementById('depoDots');
    const prevBtn = document.getElementById('depoPrev');
    const nextBtn = document.getElementById('depoNext');
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'depoimentos__dot';
      dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function update(){
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function goTo(index){
      current = (index + slides.length) % slides.length;
      update();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    update();

    // Avança automaticamente a cada 6s, pausando ao interagir
    let autoplay = setInterval(() => goTo(current + 1), 6000);
    [prevBtn, nextBtn, track].forEach(el => {
      el.addEventListener('mouseenter', () => clearInterval(autoplay));
      el.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => goTo(current + 1), 6000);
      });
    });
  }

  // Accordion de FAQ
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq__answer').style.maxHeight = null;
      });

      if (!isOpen){
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

});