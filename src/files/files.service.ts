import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  public async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    if (!file) {
      throw new BadRequestException({
        errors: [
          {
            file: 'selectFile',
          },
        ],
      });
    }
    const path: Record<files.FileType, string> = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };

    const sizes: Record<files.FileType, number | undefined> = {
      local: file.size,
      s3: file.size,
      firebase: file.fileRef?.metadata?.size,
    };

    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[this.configService.get('file.driver')],
        size: sizes[this.configService.get('file.driver')],
        mimetype: file.mimetype,
        fileName: file.originalname,
      }),
    );
  }

  public async fileById(id: string): Promise<FileEntity> {
    const file = this.fileRepository.findOne({
      where: { id: id },
    });

    if (!file) {
      throw new NotFoundException({
        errors: [
          {
            user: 'file do not exist',
          },
        ],
      });
    }

    return file;
  }
}
