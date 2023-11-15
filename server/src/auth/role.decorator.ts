import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleType } from './auth.class';

export const Roles = Reflector.createDecorator<UserRoleType[]>();

