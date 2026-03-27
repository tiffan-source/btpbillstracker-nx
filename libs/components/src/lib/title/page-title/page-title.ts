import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-page-title',
  imports: [],
  template: `<h1 class="text-3xl font-bold">{{ title() }}</h1>`,
})
export class PageTitle {
    title = input.required<string>();
}


@Component({
  selector: 'lib-page-subtitle',
  imports: [],
  template: `<h2>{{ title() }}</h2>`,
})
export class PageSubTitle {
    title = input.required<string>();
}
