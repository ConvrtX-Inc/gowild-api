import { Controller, UseGuards } from '@nestjs/common';
import { SocialAccountService } from './social-account.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { SocialAccount } from './social-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SocialAccount')
@Crud({
  model: {
    type: SocialAccount,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: true,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@Controller({
  path: 'social-account',
  version: '1',
})
export class SocialAccountController implements CrudController<SocialAccount> {
  constructor(public service: SocialAccountService) {}

  get base(): CrudController<SocialAccount> {
    return this;
  }
}
