import { Body, Controller, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { SystemSupportService } from './system-support.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { SystemSupport } from './system-support.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpCode, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { CreateSupportMessageDto } from './dto/create-supportmessage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('System Support')
@Crud({
  model: {
    type: SystemSupport,
  },
  routes: {
    exclude: [
      'replaceOneBase',
      'createManyBase',
      'getOneBase',
      'getManyBase',
      'createOneBase',
      'updateOneBase',
    ],
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
  path: 'system-supports',
  version: '1',
})
export class SystemSupportController implements CrudController<SystemSupport> {
  constructor(public service: SystemSupportService,private readonly configService: ConfigService,) {}

  get base(): CrudController<SystemSupport> {
    return this;
  }

// Update File
 @ApiResponse({ type: SystemSupport })
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
 @Post('/update-file/:ticket_id/:message_id')
 @HttpCode(HttpStatus.OK)
 @UseInterceptors(FileInterceptor('file'))
 public async updateImage(
   @Request() request: Express.Request,
   @Param('ticket_id') ticket_id: string,
   @Param('message_id') message_id: string,
   @UploadedFile() file: Express.Multer.File,
 ) {
   const driver = this.configService.get('file.driver');
   const attachment = {
     local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
     s3: file.location,
     firebase: file.publicUrl,
   };
   return this.service.updateFile(ticket_id,message_id,request.user.sub, attachment[driver]);
 }


// create SSM
  @ApiOperation({ summary: 'Create System Support Message' })
  @Post('message')
  public async addOneMessage(@Request() request: Express.Request, @Body() payload: CreateSupportMessageDto) {
    return await this.service.addMessage(request.user.sub, payload);
  }
}
