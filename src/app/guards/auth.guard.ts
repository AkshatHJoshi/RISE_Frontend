import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

// export const authGuard: CanActivateFn = (route, state) => {
//   if (this.auth.isloggedIn()) {
//     return true;
//   } else {
//     return false;
//   }
// };
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(NgToastService);
  if (authService.isloggedIn()) {
    return true;
  } else {
    toast.error({ detail: 'ERROR', summary: 'Please Login First!' });
    router.navigate(['login']);
    return false;
  }
};
