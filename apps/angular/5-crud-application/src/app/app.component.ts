import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Todo } from './todo.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-root',
  template: `
    <div *ngFor="let todo of todos">
      {{ todo.id }} | {{ todo.title }}
      <button class="button" (click)="update(todo)">Update</button>

      <button class="button" (click)="delete(todo)">Delete</button>
      <br />
      <br />
    </div>
  `,
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  todos!: Todo[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe((todos) => {
        this.todos = todos;
      });
  }

  update(todo: Todo) {
    this.http
      .put(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        JSON.stringify({
          id: todo.id,
          title: randText(),
          userId: todo.userId,
          completed: todo.completed,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
      .subscribe((todoUpdated) => {
        // Remove the old element and add the updated element as the first element in the array;
        this.todos = this.todos = [
          ...this.todos.filter((t) => t.id !== todo.id),
        ];
        this.todos.unshift(todoUpdated as Todo);
      });
  }

  delete(todo: Todo) {
    this.http
      .delete(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .subscribe(() => {
        // Remove the deleted element from the array;
        this.todos = [...this.todos.filter((t) => t.id !== todo.id)];
      });
  }
}
