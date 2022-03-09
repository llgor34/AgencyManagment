import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getRoles',
})
export class GetRolesPipe implements PipeTransform {
  transform(value: { [key: string]: boolean }) {
    const ownedRoles = Object.keys(value).filter((key) => value[key]);
    return ownedRoles.toString();
  }
}
