import { Body, Controller, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusEnum } from 'src/auth/status.enum';
import { validationOptions } from '../utils/validation-options';
import { PictureUpdateDto } from './dtos/picture-update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
      picture: {
        eager: true,
        exclude: ['createdDate', 'updatedDate'],
      },
      status: {
        eager: false,
        exclude: ['createdDate', 'updatedDate', 'isActive'],
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
  constructor(public service: UsersService) {
  }

  get base(): CrudController<User> {
    return this;
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.softDelete(request.params.id);
  }

  @ApiResponse({ type: User })
  @ApiOperation({ summary: 'Approved an user.' })
  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  public async approveUser(@Param('id') id: string) {
    return this.service.updateUserStatus(id, StatusEnum.Approved);
  }

  @ApiResponse({ type: User })
  @ApiOperation({ summary: 'Reject an user.' })
  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  public async rejectUser(@Param('id') id: string) {
    return this.service.updateUserStatus(id, StatusEnum.Rejected);
  }

  @ApiResponse({ type: User })
  @ApiBody({ type: PictureUpdateDto })
  @ApiOperation({ summary: 'Update user\'s profile picture' })
  @Post(':id/update-avatar')
  @HttpCode(HttpStatus.OK)
  public async updateAvatar(@Param('id') id: string, @Body() dto: PictureUpdateDto) {
    return this.service.updateAvatar(id, dto.fileId);
  }
}
