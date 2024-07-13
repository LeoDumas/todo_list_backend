import { SetMetadata } from '@nestjs/common';

// This decorator allow the user to access unrestricted routes and do call on login and register
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
