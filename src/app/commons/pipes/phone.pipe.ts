import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  public transform(value: string, ...args: string[]): string {
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    return value
      .replace(/\D/g, '')
      .replace(/^(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})$/, '($1) $2 $3-$4');
  }
}
