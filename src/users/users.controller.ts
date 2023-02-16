import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CrudController } from '@nestjsx/crud';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { ImageVerificationService } from './image.verification.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController implements CrudController<UserEntity> {
  constructor(
    public service: UsersService,
    private readonly configService: ConfigService,
    private imageVerificationService: ImageVerificationService
  ) { }

  get base(): CrudController<UserEntity> {
    return this;
  }

  @ApiResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Update user profile' })
  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.USER)
  public async updateProfile(
    @Request() request: Express.Request,
    @Body() dto: UpdateUserDto,
  ) {
    return this.service.updateProfile(request.user?.sub, dto);
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
  @ApiOperation({ summary: 'Update user images' })
  @Post('update-pictures')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'frontImage', maxCount: 1 },
      { name: 'backImage', maxCount: 1 },
    ]),
  )
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.USER)
  public async updatePictures(
    @Request() request: Express.Request,
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File;
      frontImage?: Express.Multer.File;
      backImage?: Express.Multer.File;
    },
  ) {
    const images = {
      picture: null,
      frontImage: null,
      backImage: null,
    };
    const keys = ['picture', 'frontImage', 'backImage'];
    const driver = this.configService.get('file.driver');
    for (const key of keys) {
      if (key in files) {
        images[key] = {
          local: `/${this.configService.get('app.apiPrefix')}/v1/${files[key][0].path}`,
          s3: files[key][0].location,
          firebase: files[key][0].publicUrl,
        };
      }
    }
    return this.service.updatePictures(
      request.user?.sub,
      images.picture ? images.picture[driver] : null,
      images.frontImage ? images.frontImage[driver] : null,
      images.backImage ? images.backImage[driver] : null,
    );
  }

  @Post('image-verification')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.USER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
    ]),
  )
  public async updatePicture(
    @Request() req,
    @UploadedFiles()
    files: { image1?: Express.Multer.File; image2?: Express.Multer.File },
  ) {
    const images = {
      image1: null,
      image2: null,
    };
    const keys = ['image1', 'image2'];
    for (const key of keys) {
      if (key in files) {
        images[key] = {
          local: files[key][0],
          s3: files[key][0].location,
          firebase: files[key][0].publicUrl,
        };
      }
    }
    try {
      const res = await this.imageVerificationService.verifyImagesAreSame(
        images.image1,
        images.image2,
      )
      if (res == true) {
        const user = this.service.selfieVerificationStatus(res, req.user.sub);
        return {
          image_verified: res,
          message: "Selfie verified successfully"
        };
      } else if (res == false) {
        return {
          image_verified: res,
          message: "Selfie not verified "
        };
      }
    } catch (error) {
      return {
        selfie_verified: false,
        message: "Selfie verification failed"
      };
    }

  }

}
