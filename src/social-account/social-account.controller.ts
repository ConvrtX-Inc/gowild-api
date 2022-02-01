import { Controller, Request, UseGuards } from '@nestjs/common';
import { SocialAccountService } from './social-account.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { SocialAccount } from './social-account.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
    alwaysPaginate: false,
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
  path: 'notifications',
  version: '1',
})
export class SocialAccountController implements CrudController<SocialAccount> {
  constructor(public service: SocialAccountService) {}

  get base(): CrudController<SocialAccount> {
    return this;
  }
}
