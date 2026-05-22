import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { ru_RU, provideNzI18n } from 'ng-zorro-antd/i18n';
import {
  UserOutline, EditOutline, DeleteOutline, PlusOutline,
  SearchOutline, ArrowLeftOutline, MailOutline, PhoneOutline,
  GlobalOutline, TeamOutline, EyeOutline,
  ReloadOutline, SaveOutline, CloseCircleOutline,
  BulbOutline, MoonOutline
} from '@ant-design/icons-angular/icons';
import { routes } from './app.routes';

const icons = [
  UserOutline, EditOutline, DeleteOutline, PlusOutline,
  SearchOutline, ArrowLeftOutline, MailOutline, PhoneOutline,
  GlobalOutline, TeamOutline, EyeOutline,
  ReloadOutline, SaveOutline, CloseCircleOutline,
  BulbOutline, MoonOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideNzI18n(ru_RU),
    provideNzIcons(icons),
  ],
};
