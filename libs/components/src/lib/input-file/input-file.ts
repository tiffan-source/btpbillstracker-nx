import { Component, input } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';


@Component({
  selector: 'lib-input-file',
  imports: [FileUploadModule],
  templateUrl: './input-file.html',
  styleUrl: './input-file.css',
})
export class InputFile {
    label = input.required<string>();
    id = input<string>();
}
