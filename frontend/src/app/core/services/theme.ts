import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  public currentTheme: 'light' | 'dark';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    this.currentTheme = storedTheme || 'light';

    if (this.currentTheme === 'dark') {
      this.renderer.addClass(document.documentElement, 'dark');
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.renderer.removeClass(document.documentElement, this.currentTheme);
    this.renderer.addClass(document.documentElement, newTheme);
    localStorage.setItem('theme', newTheme);
    this.currentTheme = newTheme;
  }
}
