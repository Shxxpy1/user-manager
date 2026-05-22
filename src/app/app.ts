import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    NzLayoutModule, NzMenuModule, NzIconModule,
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-header class="app-header">
        <div class="logo">
          <span nz-icon nzType="team" nzTheme="outline"></span>
          <span class="logo-text">User Manager</span>
        </div>
        <ul nz-menu nzTheme="dark" nzMode="horizontal" class="nav-menu">
          <li nz-menu-item [routerLink]="['/users']" routerLinkActive="ant-menu-item-selected">
            <span nz-icon nzType="user"></span> Пользователи
          </li>
          <li nz-menu-item [routerLink]="['/users/new']" routerLinkActive="ant-menu-item-selected">
            <span nz-icon nzType="plus"></span> Новый пользователь
          </li>
        </ul>
        <button
          class="theme-btn"
          [class.dark]="theme.isDark()"
          (click)="onThemeClick($event)"
          [attr.aria-label]="theme.isDark() ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'">
          <span class="theme-icon">{{ theme.isDark() ? '🌙' : '☀️' }}</span>
          <div class="thumb"></div>
        </button>
      </nz-header>
      <nz-content class="app-content">
        <div class="content-wrap">
          <router-outlet />
        </div>
      </nz-content>
      <nz-footer class="app-footer">User Manager © 2026</nz-footer>
    </nz-layout>
  `,
  styleUrls: ['./app.scss']
})
export class App {
  theme = inject(ThemeService);
  onThemeClick(e: MouseEvent): void { this.theme.toggle(e); }
}
