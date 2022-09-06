import { Controller, Get, Param, Post, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FilesDto } from './files.dto';
import { FileEntity } from './file.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {
  }

  @ApiResponse({ type: FileEntity })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: FilesDto) {
    return this.filesService.uploadFile(file);
  }

  @ApiParam({ name: 'path', type: 'string' })
  @Get(':path')
  download(@Param('path') path: string, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }
}
