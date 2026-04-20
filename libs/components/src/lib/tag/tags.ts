import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

type TagVariant = 'success' | 'info' | 'warning' | 'danger' | '';

@Component({
  selector: 'lib-tags',
    imports: [TagModule],
    templateUrl: './tags.html',
  styleUrl: './tags.css',
})
export class Tags {
    label = input.required<string>();
    variant = input<TagVariant>('');

    public mapToTagPrimeNgVariant(variant: TagVariant): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
        switch (variant) {
            case 'success':
                return 'success';
            case 'info':
                return 'info';
            case 'warning':
                return 'warn';
            case 'danger':
                return 'danger';
            default:
                return undefined;
        }
    }
}
