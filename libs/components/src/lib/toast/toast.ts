import { Component, inject, Injectable, input } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

export type ToastType = 'success' | 'error';

@Component({
  selector: 'lib-toast',
  imports: [ToastModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {
    type = input<ToastType>('success');
    message = input<string>('This is a toast message');
}

@Injectable({   
  providedIn: 'root',  
})  
export class ToastService {
    private messageService = inject(MessageService);

    showToast(type: ToastType, message: string) {
        this.messageService.add({ severity: type, summary: type.toUpperCase(), detail: message });
    }
}