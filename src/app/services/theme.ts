import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(false);
  private isAnimating = false;

  constructor() {
    // Restore saved theme before first render
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const startDark = saved ? saved === 'dark' : prefersDark;

    if (startDark) {
      this.isDark.set(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Persist on every change
    effect(() => {
      localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
    });
  }

  toggle(event: MouseEvent): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const x = event.clientX;
    const y = event.clientY;
    const nextDark = !this.isDark();

    const maxR = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    ) * 1.5;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999; pointer-events: none;
      background: ${nextDark ? '#0f1117' : '#f5f6fa'};
      clip-path: circle(0px at ${x}px ${y}px);
      transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: clip-path;
    `;
    document.body.appendChild(overlay);

    // Step 1: expand overlay to fill screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.clipPath = `circle(${maxR}px at ${x}px ${y}px)`;
      });
    });

    // Step 2: once overlay fully covers screen — apply theme (no flash visible)
    setTimeout(() => {
      this.isDark.set(nextDark);
      document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
    }, 500);

    // Step 3: fade out overlay after theme is applied
    setTimeout(() => {
      overlay.style.transition = 'opacity 0.15s ease';
      overlay.style.opacity = '0';
    }, 520);

    setTimeout(() => {
      overlay.remove();
      this.isAnimating = false;
    }, 680);
  }
}
