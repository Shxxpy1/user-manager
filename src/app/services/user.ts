import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company?: {
    name: string;
  };
}

// Single source of truth — all users are Russian from the start.
// IDs 1-10 mirror JSONPlaceholder IDs so PUT/DELETE still work against real API.
const ALL_USERS: User[] = [
  { id: 1,   name: 'Алексей Смирнов',    username: 'smirnov_a',    email: 'smirnov@yandex.ru',      phone: '+7-916-123-45-67', website: 'smirnov.ru',      company: { name: 'ООО «Альфа»' },          address: { street: 'ул. Тверская',           suite: 'кв. 12',  city: 'Москва',            zipcode: '125009' } },
  { id: 2,   name: 'Екатерина Попова',   username: 'popova_e',     email: 'popova@mail.ru',          phone: '+7-812-234-56-78', website: 'popova.spb.ru',   company: { name: 'АО «Балтика»' },         address: { street: 'Невский пр.',             suite: 'оф. 301', city: 'Санкт-Петербург',   zipcode: '191186' } },
  { id: 3,   name: 'Дмитрий Козлов',     username: 'kozlov_d',     email: 'kozlov@gmail.com',        phone: '+7-343-345-67-89', website: 'kozlov.dev',      company: { name: 'IT-Урал' },              address: { street: 'ул. Ленина',             suite: 'оф. 5',   city: 'Екатеринбург',      zipcode: '620000' } },
  { id: 4,   name: 'Мария Иванова',      username: 'ivanova_m',    email: 'm.ivanova@bk.ru',         phone: '+7-383-456-78-90', website: '',                company: { name: 'СберТех' },              address: { street: 'Красный пр.',             suite: 'кв. 44',  city: 'Новосибирск',       zipcode: '630099' } },
  { id: 5,   name: 'Сергей Новиков',     username: 'novikov_s',    email: 'novikov@rambler.ru',      phone: '+7-861-567-89-01', website: 'novikov.io',      company: { name: 'ЮгСофт' },              address: { street: 'ул. Красная',            suite: 'кв. 7',   city: 'Краснодар',         zipcode: '350000' } },
  { id: 6,   name: 'Анна Морозова',      username: 'morozova_an',  email: 'morozova@inbox.ru',       phone: '+7-843-678-90-12', website: '',                company: { name: 'КазаньЭкспресс' },       address: { street: 'ул. Баумана',            suite: 'оф. 2',   city: 'Казань',            zipcode: '420000' } },
  { id: 7,   name: 'Павел Волков',       username: 'volkov_p',     email: 'p.volkov@yandex.ru',      phone: '+7-351-789-01-23', website: 'volkov.pro',      company: { name: 'ЧелМаш' },              address: { street: 'пр. Ленина',             suite: 'кв. 18',  city: 'Челябинск',         zipcode: '454000' } },
  { id: 8,   name: 'Ольга Соколова',     username: 'sokolova_o',   email: 'sokolova@list.ru',        phone: '+7-831-890-12-34', website: '',                company: { name: 'НижегородТрейд' },       address: { street: 'ул. Большая Покровская', suite: 'кв. 3',   city: 'Нижний Новгород',   zipcode: '603000' } },
  { id: 9,   name: 'Игорь Лебедев',      username: 'lebedev_i',    email: 'lebedev@corp.ru',         phone: '+7-863-901-23-45', website: 'lebedev.design',  company: { name: 'РостовДизайн' },         address: { street: 'пр. Будённовский',       suite: 'оф. 10',  city: 'Ростов-на-Дону',    zipcode: '344000' } },
  { id: 10,  name: 'Наталья Козлова',    username: 'kozlova_nat',  email: 'nat.kozlova@mail.ru',     phone: '+7-473-012-34-56', website: '',                company: { name: 'ВоронежСофт' },          address: { street: 'пр. Революции',          suite: 'кв. 21',  city: 'Воронеж',           zipcode: '394000' } },
  { id: 101, name: 'Артём Петров',       username: 'petrov_art',   email: 'a.petrov@yandex.ru',      phone: '+7-395-123-45-67', website: 'petrov.tech',     company: { name: 'СибирьТех' },            address: { street: 'ул. Советская',          suite: 'оф. 15',  city: 'Иркутск',           zipcode: '664000' } },
  { id: 102, name: 'Виктория Семёнова',  username: 'semenova_v',   email: 'v.semenova@bk.ru',        phone: '+7-846-234-56-78', website: '',                company: { name: 'СамараАвто' },            address: { street: 'ул. Куйбышева',          suite: 'кв. 9',   city: 'Самара',            zipcode: '443000' } },
  { id: 103, name: 'Максим Фёдоров',     username: 'fedorov_max',  email: 'max.fedorov@gmail.com',   phone: '+7-347-345-67-89', website: 'fedorov.ru',      company: { name: 'БашнефтьИТ' },           address: { street: 'ул. Ленина',             suite: 'оф. 7',   city: 'Уфа',               zipcode: '450000' } },
  { id: 104, name: 'Татьяна Михайлова',  username: 'mikhaylova_t', email: 't.mikhaylova@inbox.ru',   phone: '+7-422-456-78-90', website: '',                company: { name: 'ВладТрейд' },            address: { street: 'ул. Светланская',        suite: 'кв. 5',   city: 'Владивосток',       zipcode: '690000' } },
  { id: 105, name: 'Роман Захаров',      username: 'zakharov_r',   email: 'r.zakharov@corp.ru',      phone: '+7-982-567-89-01', website: 'zakharov.io',     company: { name: 'ПермьДев' },             address: { street: 'ул. Ленина',             suite: 'оф. 22',  city: 'Пермь',             zipcode: '614000' } },
  { id: 106, name: 'Людмила Фролова',    username: 'frolova_l',    email: 'frolova@yandex.ru',       phone: '+7-391-678-90-12', website: '',                company: { name: 'КрасГрупп' },            address: { street: 'пр. Мира',              suite: 'кв. 33',  city: 'Красноярск',        zipcode: '660000' } },
  { id: 107, name: 'Николай Егоров',     username: 'egorov_n',     email: 'n.egorov@mail.ru',        phone: '+7-412-789-01-23', website: 'egorov.biz',      company: { name: 'ОмскТех' },              address: { street: 'ул. Гагарина',           suite: 'оф. 4',   city: 'Омск',              zipcode: '644000' } },
  { id: 108, name: 'Светлана Орлова',    username: 'orlova_sv',    email: 'orlova@inbox.ru',         phone: '+7-3412-890-12-34',website: '',                company: { name: 'ИжТрейд' },              address: { street: 'ул. Пушкина',           suite: 'кв. 11',  city: 'Ижевск',            zipcode: '426000' } },
  { id: 109, name: 'Вадим Соловьёв',     username: 'solovev_v',    email: 'v.solovev@bk.ru',         phone: '+7-8552-901-23-45', website: 'solovev.ru',     company: { name: 'НабережноеИТ' },         address: { street: 'пр. Победы',            suite: 'оф. 8',   city: 'Набережные Челны',  zipcode: '423800' } },
  { id: 110, name: 'Ирина Васильева',    username: 'vasilieva_i',  email: 'i.vasilieva@gmail.com',   phone: '+7-4812-012-34-56', website: '',               company: { name: 'СмолСофт' },             address: { street: 'ул. Николаева',         suite: 'кв. 2',   city: 'Смоленск',          zipcode: '214000' } },
  { id: 111, name: 'Денис Зайцев',       username: 'zaitsev_d',    email: 'd.zaitsev@corp.ru',       phone: '+7-4872-123-45-67', website: 'zaitsev.dev',    company: { name: 'ТульскийЗавод' },        address: { street: 'пр. Ленина',            suite: 'оф. 19',  city: 'Тула',              zipcode: '300000' } },
  { id: 112, name: 'Кристина Борисова',  username: 'borisova_k',   email: 'k.borisova@yandex.ru',    phone: '+7-3532-234-56-78', website: '',               company: { name: 'ОренбургТрейд' },        address: { street: 'ул. Советская',         suite: 'кв. 14',  city: 'Оренбург',          zipcode: '460000' } },
  { id: 113, name: 'Евгений Кузнецов',   username: 'kuznetsov_e',  email: 'e.kuznetsov@rambler.ru',  phone: '+7-4152-345-67-89', website: 'kuznetsov.io',   company: { name: 'КамчаткаТех' },          address: { street: 'пр. Победы',            suite: 'оф. 3',   city: 'Петропавловск-К.',  zipcode: '683000' } },
  { id: 114, name: 'Юлия Тихонова',      username: 'tikhonova_yu', email: 'yu.tikhonova@mail.ru',    phone: '+7-8112-456-78-90', website: '',               company: { name: 'МурманскСервис' },        address: { street: 'пр. Ленина',            suite: 'кв. 6',   city: 'Мурманск',          zipcode: '183000' } },
  { id: 115, name: 'Андрей Никитин',     username: 'nikitin_an',   email: 'a.nikitin@bk.ru',         phone: '+7-8182-567-89-01', website: 'nikitin.pro',    company: { name: 'АрхангельскДев' },        address: { street: 'пр. Троицкий',          suite: 'оф. 17',  city: 'Архангельск',       zipcode: '163000' } },
];

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  /** Returns all users from local data (consistent, all Russian) */
  getUsers(): Observable<User[]> {
    return of([...ALL_USERS]);
  }

  /** Finds user in local data first; falls back to API only for unknown IDs */
  getUser(id: number): Observable<User> {
    const found = ALL_USERS.find(u => u.id === id);
    if (found) return of({ ...found });
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /** POST to real API for create (JSONPlaceholder accepts but doesn't persist) */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /** PUT to real API for IDs 1-10; local-only for others */
  updateUser(id: number, user: User): Observable<User> {
    if (id <= 10) return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    return of({ ...user, id });
  }

  /** DELETE to real API for IDs 1-10; local-only for others */
  deleteUser(id: number): Observable<void> {
    if (id <= 10) return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(void 0);
  }
}
