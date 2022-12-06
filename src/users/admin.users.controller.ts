import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request, UploadedFiles,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody, ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StatusEnum } from 'src/auth/status.enum';
import {RolesGuard} from "../roles/roles.guard";
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import { validationOptions } from '../common/validation-options';
import { ImageUpdateDto } from './dtos/image-update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {FilesService} from "../files/files.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Admin-Users')
@Crud({
  validation: validationOptions,
  model: {
    type: UserEntity,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: true,
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
  path: 'admin/users',
  version: '1',
})
export class AdminUsersController implements CrudController<UserEntity> {
  constructor(public service: UsersService, private readonly filesService: FilesService) {}

  get base(): CrudController<UserEntity> {
    return this;
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.softDelete(request.params.id);
  }

  @ApiResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Approved an user.' })
  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  public async approveUser(@Param('id') id: string) {
    return this.service.updateUserStatus(id, StatusEnum.Approved);
  }

  @ApiResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Reject an user.' })
  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  public async rejectUser(@Param('id') id: string) {
    return this.service.updateUserStatus(id, StatusEnum.Rejected);
  }

  @ApiResponse({ type: UserEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: "Update user images" })
  @Post(':id/update-pictures')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
  ]))
  @HttpCode(HttpStatus.OK)
  public async updatePictures(
    @Param('id') id: string,
    @UploadedFiles() files: { picture?: Express.Multer.File, frontImage?: Express.Multer.File , backImage?: Express.Multer.File },
  ) {
    const images = {
      picture: null,
      frontImage: null,
      backImage: null,

    };
    const keys = ['picture', 'frontImage', 'backImage'];
    for (const key of keys)
    {
      if(key in files){
        images[key] = await this.filesService.uploadFile(files[key][0]);
      }
    }

     return this.service.updatePictures(id, images.picture, images.frontImage, images.backImage);
  }

  @Override('getManyBase')
  async findManyEntities() {
    return this.service.findAllUsers();
  }

  @Override('getOneBase')
  async findOneEntity(@Request() request){
    return this.service.findOneUser(request.params.id)
  }
 
}
