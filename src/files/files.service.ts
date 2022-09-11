import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import { FilesDto } from './files.dto';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  public async uploadFile(file: FilesDto): Promise<FileEntity> {
    if (!file) {
      throw new BadRequestException({
        errors: [
          {
            file: 'selectFile',
          },
        ],
      });
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
    };

    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[this.configService.get('file.driver')],
        size: file.size,
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
