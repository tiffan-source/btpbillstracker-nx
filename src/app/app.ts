import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast } from '@btpbilltracker/components';

@Component({
  imports: [RouterModule, Toast],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
}
