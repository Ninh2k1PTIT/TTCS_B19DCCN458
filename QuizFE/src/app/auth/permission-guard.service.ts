import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuardService implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAdmin = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    )?.roles?.includes('admin');
    if (!isAdmin) {
      this.router.navigate(['/practice']);
    }
    return isAdmin;
  }
}
