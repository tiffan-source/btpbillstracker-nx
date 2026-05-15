import { Component, input, output } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';


@Component({
  selector: 'lib-input-file',
  imports: [FileUploadModule],
  templateUrl: './input-file.html',
  styleUrl: './input-file.css',
})
export class InputFile {
    id = input<string>();
    
    // On crée un événement de sortie qui va émettre un objet File (ou null)
    fileSelected = output<File | null>();

    // Méthode appelée quand PrimeNG détecte un fichier
    onPrimeNgFileSelect(event: any): void {
        // PrimeNG renvoie un objet avec une propriété 'files' (un tableau)
        if (event.files && event.files.length > 0) {
            const file: File = event.files[0];
            this.fileSelected.emit(file); // On fait remonter le fichier au parent
        } else {
            this.fileSelected.emit(null);
        }
    }

    onPrimeNgFileRemove($event: any): void {
        this.fileSelected.emit(null);
    }
}
