import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {
  transform(base: string, value: string): string {
    if (!base && !value) {
      return '/';
    }

    // Sanitize and format both strings

    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    if (!base) {
      return `/${value}/`;
    }


    const sanitizedBase = base.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    if (!value) {
      return `/${base}/`;
    }
    
    return `/${sanitizedBase}/${sanitizedValue}/`;


  }
}
