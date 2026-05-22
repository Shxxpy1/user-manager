import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserService, User } from '../../services/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    RouterLink, FormsModule,
    NzTableModule, NzButtonModule, NzInputModule,
    NzIconModule, NzPopconfirmModule, NzTagModule,
    NzCardModule, NzSpaceModule, NzTypographyModule,
    NzSkeletonModule, NzEmptyModule, NzAlertModule,
    NzPaginationModule,
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  displayUsers: User[] = [];
  loading = true;
  loadError: string | null = null;
  searchText = '';
  deletingIds = new Set<number>();

  pageIndex = 1;
  pageSize = 5;
  total = 0;
  pageSizes = [5, 10, 20];

  skeletonRows = Array(5).fill(0);

  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private overlayContainer: OverlayContainer,
  ) {}

  ngOnInit(): void { this.loadUsers(); }

  ngOnDestroy(): void {
    this.closeOverlays();
  }

  private closeOverlays(): void {
    try {
      const container = this.overlayContainer.getContainerElement();
      container.querySelectorAll('.cdk-overlay-pane').forEach(el => el.remove());
      container.querySelectorAll('.cdk-overlay-backdrop').forEach(el => el.remove());
    } catch {}
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    );
  }

  loadUsers(): void {
    this.loading = true;
    this.loadError = null;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.applyFilter();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loadError = this.formatError(err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const q = this.searchText.toLowerCase().trim();
    this.filteredUsers = q
      ? this.allUsers.filter(u =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      : [...this.allUsers];

    this.total = this.filteredUsers.length;

    const maxPage = Math.max(1, Math.ceil(this.total / this.pageSize));
    if (this.pageIndex > maxPage) this.pageIndex = maxPage;

    this.slicePage();
  }

  slicePage(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    this.displayUsers = this.filteredUsers.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.applyFilter();
  }

  onPageChange(index: number): void {
    this.pageIndex = index;
    this.slicePage();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.applyFilter();
  }

  deleteUser(id: number): void {
    this.deletingIds.add(id);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.message.success('Пользователь удалён');
        this.allUsers = this.allUsers.filter(u => u.id !== id);
        this.deletingIds.delete(id);
        this.applyFilter();
      },
      error: (err: HttpErrorResponse) => {
        this.message.error(`Не удалось удалить: ${this.formatError(err)}`);
        this.deletingIds.delete(id);
      }
    });
  }

  isDeleting(id: number): boolean { return this.deletingIds.has(id); }

  formatError(err: HttpErrorResponse): string {
    if (!navigator.onLine) return 'Нет подключения к интернету';
    if (err.status === 0) return 'Сервер недоступен';
    if (err.status === 404) return 'Ресурс не найден (404)';
    if (err.status === 500) return 'Ошибка сервера (500)';
    return `Ошибка ${err.status}: ${err.statusText}`;
  }

  tagColor(i: number): string {
    const colors = ['blue','green','orange','purple','cyan','red','gold','lime','volcano','geekblue'];
    return colors[i % colors.length];
  }

  get isSearchEmpty(): boolean {
    return !this.loading && this.searchText.trim().length > 0 && this.filteredUsers.length === 0;
  }
  get isListEmpty(): boolean {
    return !this.loading && !this.loadError && this.allUsers.length === 0;
  }
}
