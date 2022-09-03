import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { User } from './user';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import validationOptions from 'src/utils/validation-options';
import { StatusEnum } from 'src/auth/status.enum';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@Crud({
  validation: validationOptions,
  model: {
    type: User,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: false,
    join: {
      status: {
        eager: false,
        exclude: ['createDate', 'updatedDate'],
      },
    },
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
  path: 'users',
  version: '1',
})
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.softDelete(request.params.id);
  }

  @ApiOperation({ summary: 'Approved an user.' })
  @Post('approved-user/:id')
  @HttpCode(HttpStatus.OK)
  public async approveUser(@Param('id') id: string) {
    return this.service.updateUserStatus(id, StatusEnum.Approved);
  }

  @ApiOperation({ summary: 'Reject an user.' })
  @Post('reject-user/:id')
  @HttpCode(HttpStatus.OK)
  public async rejectUser(@Param('id') id: string) {
    return this.service.updateUserStatus(id, StatusEnum.Rejected);
  }
}
