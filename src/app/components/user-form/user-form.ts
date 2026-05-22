import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule,
    NzCardModule, NzInputModule,
    NzButtonModule, NzIconModule, NzSkeletonModule,
    NzGridModule, NzAlertModule,
    // NzFormModule intentionally removed — we render errors manually
  ],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  userId?: number;
  loading = false;
  submitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(2)]],
      username:    ['', [Validators.required]],
      email:       ['', [Validators.required, Validators.email]],
      phone:       [''],
      website:     [''],
      companyName: [''],
      street:      [''],
      city:        [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = Number(id);
      this.loading = true;
      this.userService.getUser(this.userId).subscribe({
        next: (u) => {
          this.form.patchValue({
            name: u.name, username: u.username, email: u.email,
            phone: u.phone ?? '', website: u.website ?? '',
            companyName: u.company?.name ?? '',
            street: u.address?.street ?? '', city: u.address?.city ?? '',
          });
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.message.error(`Не удалось загрузить пользователя: ${err.status}`);
          this.loading = false;
        }
      });
    }
  }

  /** True when field is invalid AND touched — controls error visibility */
  isTouched(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitError = null;
    const v = this.form.value;
    const user = {
      name: v.name, username: v.username, email: v.email,
      phone: v.phone, website: v.website,
      company: { name: v.companyName },
      address: { street: v.street, suite: '', city: v.city, zipcode: '' }
    };

    this.submitting = true;
    const req$ = this.isEdit
      ? this.userService.updateUser(this.userId!, user)
      : this.userService.createUser(user);

    req$.subscribe({
      next: () => {
        this.message.success(this.isEdit ? 'Пользователь обновлён!' : 'Пользователь создан!');
        this.router.navigate(['/users']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitError = `Ошибка ${err.status}: не удалось сохранить данные.`;
        this.submitting = false;
      }
    });
  }

  get f() { return this.form.controls; }
}
