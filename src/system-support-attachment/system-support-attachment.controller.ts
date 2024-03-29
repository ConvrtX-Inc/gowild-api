import { Controller, UseGuards } from '@nestjs/common';
import { SystemSupportAttachmentService } from './system-support-attachment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { SystemSupportAttachment } from './system-support-attachment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('System Support Attachment')
@Crud({
  model: {
    type: SystemSupportAttachment,
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
  path: 'system-support-attachments',
  version: '1',
})
export class SystemSupportAttachmentController
  implements CrudController<SystemSupportAttachment>
{
  constructor(public service: SystemSupportAttachmentService) {}

  get base(): CrudController<SystemSupportAttachment> {
    return this;
  }
}
