import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {
  transform(base:string, value: string): string {
    if (!base && !value) {
      return '/';
    }

    // Sanitize and format both strings
    const sanitizedBase = base.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    return `/${sanitizedBase}/${sanitizedValue}/`;
  
  }
}
