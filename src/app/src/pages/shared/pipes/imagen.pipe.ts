import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {
  constructor(public domSanitizer:DomSanitizer) {}
  transform(value: any, args?: any) {
    if (typeof(value) != 'undefined') {
       return this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' +value);
    }else{
       return this.domSanitizer.bypassSecurityTrustUrl('');
    }
}
}
