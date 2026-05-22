import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzResultModule } from 'ng-zorro-antd/result';
import { UserService, User } from '../../services/user';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    RouterLink, NzCardModule, NzButtonModule, NzDescriptionsModule,
    NzIconModule, NzSkeletonModule, NzPopconfirmModule, NzTagModule,
    NzSpaceModule, NzAlertModule, NzResultModule
  ],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = true;
  deleting = false;
  loadError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id) || id <= 0) {
      this.loadError = 'Некорректный идентификатор пользователя';
      this.loading = false;
      return;
    }
    this.loadUser(id);
  }

  loadUser(id: number): void {
    this.loading = true;
    this.loadError = null;
    this.userService.getUser(id).subscribe({
      next: (u) => { this.user = u; this.loading = false; },
      error: (err: HttpErrorResponse) => {
        this.loadError = err.status === 404
          ? 'Пользователь не найден'
          : `Ошибка загрузки: ${err.status} ${err.statusText}`;
        this.loading = false;
      }
    });
  }

  delete(): void {
    this.deleting = true;
    this.userService.deleteUser(this.user!.id!).subscribe({
      next: () => {
        this.message.success('Пользователь удалён');
        this.router.navigate(['/users']);
      },
      error: (err: HttpErrorResponse) => {
        this.message.error(`Не удалось удалить: ${err.status} ${err.statusText}`);
        this.deleting = false;
      }
    });
  }
}
