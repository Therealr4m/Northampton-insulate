'use strict';
// Ever Warm Northampton — progressive enhancements. No tracking or third-party form services.
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const closeMenu = () => {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
};
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    mobileNav.hidden = isOpen;
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!menuButton.contains(event.target) && !mobileNav.contains(event.target)) closeMenu();
  });
}
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const serviceChoices = {
  'loft-insulation-installation': `Full Loft Insulation Installation`,
  'loft-insulation-removal': `Loft Insulation Removal`,
  'loft-boarding': `Loft Boarding`,
  'loft-insulation-top-ups': `Loft Insulation Top-Ups`
};
const selectedService = new URLSearchParams(window.location.search).get('service');
document.querySelectorAll('[data-enquiry-form]').forEach(form => {
  const select = form.elements.namedItem('service');
  const endpoint = (form.dataset.formEndpoint || '').trim();
  const submitButton = form.querySelector('.form-submit');
  const status = form.querySelector('[data-form-status]');
  if (endpoint && submitButton) submitButton.firstChild.textContent = 'Send enquiry';
  if (select && selectedService && Object.prototype.hasOwnProperty.call(serviceChoices,selectedService)) {
    select.value = serviceChoices[selectedService];
  }
  const state = (message, kind='') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = kind;
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const service = String(values.get('service') || 'General enquiry');
    const subject = `Ever Warm Northampton enquiry — ${service}`;
    const enquiry = [
      `Name: ${values.get('name') || ''}`,
      `Email: ${values.get('email') || ''}`,
      `Phone: ${values.get('phone') || 'Not provided'}`,
      `Service: ${service}`, '', 'Message:', String(values.get('message') || '')
    ].join('\n');
    const recipient = form.dataset.recipient || 'enquiries.pillar@gmail.com';
    const fallback = form.querySelector('.form-fallback');
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiry)}`;
    const emailLink = form.querySelector('.prepared-email-link');
    if (emailLink) emailLink.href = mailto;
    if (fallback) {
      const text = fallback.querySelector('textarea');
      if (text) text.value = `To: ${recipient}\nSubject: ${subject}\n\n${enquiry}`;
    }
    if (endpoint) {
      if (submitButton) submitButton.disabled = true;
      state('Sending your enquiry…');
      try {
        const response = await fetch(endpoint, {
          method: 'POST', headers: {'Accept': 'application/json'},
          body: (() => {const data = new FormData(form); data.append('_subject',subject);return data})()
        });
        if (!response.ok) throw new Error('Service did not confirm submission');
        form.reset();
        if (fallback) fallback.hidden = true;
        state('Your enquiry was submitted successfully.', 'success');
        return;
      } catch (_) {
        state('We could not confirm delivery. Please use the email option below instead.', 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    } else {
      state('Your enquiry is prepared. It has not been sent yet.');
    }
    if (fallback) {
      fallback.hidden = false;
      fallback.scrollIntoView({block:'nearest',behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }
  });
  const copyButton = form.querySelector('[data-copy-enquiry]');
  copyButton?.addEventListener('click', async () => {
    const text = form.querySelector('.form-fallback textarea');
    const msg = form.querySelector('.copy-status');
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text.value);
      else {text.focus(); text.select(); if (!document.execCommand('copy')) throw Error('No clipboard access');}
      if (msg) msg.textContent = 'Copied!';
    } catch (_) {
      if (msg) msg.textContent = 'Select the text above and copy it manually.';
      text.focus();text.select();
    }
  });
});

const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const enlarged = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let previousFocus = null;
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    previousFocus?.focus();
  }
  document.querySelectorAll('[data-gallery]').forEach(button => {
    button.addEventListener('click', () => {
      previousFocus = document.activeElement;
      enlarged.src = button.dataset.gallery;
      enlarged.alt = button.dataset.alt || 'Loft photograph';
      lightbox.hidden = false;
      document.body.classList.add('no-scroll');
      closeButton?.focus();
    });
  });
  closeButton?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'Tab') { event.preventDefault(); closeButton?.focus(); }
  });
}

// Reveal content gently on scroll; all content remains visible when JS is disabled.
if (typeof IntersectionObserver !== 'undefined' && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const revealTargets = [...document.querySelectorAll('[data-reveal]')];
  if (revealTargets.length) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {rootMargin: '0px 0px 100px 0px', threshold: 0.04});
    revealTargets.forEach(item => observer.observe(item));
  }
}

// Close the header All pages menu when navigating away, clicking outside or pressing Escape.
const pagesDropdown = document.querySelector('.pages-menu');
if (pagesDropdown) {
  document.addEventListener('pointerdown', event => {
    if (pagesDropdown.open && !pagesDropdown.contains(event.target)) pagesDropdown.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && pagesDropdown.open) {
      pagesDropdown.open = false;
      pagesDropdown.querySelector('summary')?.focus();
    }
  });
}

// Only one desktop dropdown should remain open at a time.
const areasDropdown = document.querySelector('.areas-menu');
if (areasDropdown) {
  areasDropdown.addEventListener('toggle', () => {
    if (areasDropdown.open && pagesDropdown) pagesDropdown.open = false;
  });
  document.addEventListener('pointerdown', event => {
    if (areasDropdown.open && !areasDropdown.contains(event.target)) areasDropdown.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && areasDropdown.open) {
      areasDropdown.open = false;
      areasDropdown.querySelector('summary')?.focus();
    }
  });
}
if (pagesDropdown) pagesDropdown.addEventListener('toggle', () => {
  if (pagesDropdown.open && areasDropdown) areasDropdown.open = false;
});
