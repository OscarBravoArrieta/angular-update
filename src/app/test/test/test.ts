import { Component, inject } from '@angular/core';
import { TestService } from '../test-service';


@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.html',
  styleUrl: './test.scss',
})
export class Test {
  users: unknown[] = [];
  private userService = inject(TestService);
  getUser() {
    //this.userService.getUsers().subscribe((data:unknown) => (this.users = data));

  }

}
