import { Controller, Get, Post, Body, Request, Patch, Param, Delete, HttpStatus,HttpCode, UseGuards } from '@nestjs/common';
import { SubAdminService } from './sub-admin.service';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { UpdateSubAdminDto } from './dto/update-sub-admin.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/users/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { Crud, CrudController, CrudService, Override } from '@nestjsx/crud';
import { request } from 'http';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Sub-Admin')
@Crud({
  model: {
    type: UserEntity,
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
  path: 'sub-admin',
  version: '1',
})
export class SubAdminController implements CrudController<UserEntity> {
  constructor(private readonly subAdminService: SubAdminService) {}
  service: CrudService<UserEntity>;
  
 


@Override('createOneBase')
async createOneEntity(@Body() dto:CreateSubAdminDto){
  return this.subAdminService.registerSubAdmin(dto)
}
 

@Override('updateOneBase')
async updateOneEntity(@Param('id') id: string, @Body() dto: UpdateUserDto){
  return this.subAdminService.updateSubAdmin(id, dto)
}

@Override('deleteOneBase')
async deleteOneEntity(@Request() request){
  return this.subAdminService.deleteSubAdmin(request.params.id)
}

@Override('getOneBase')
async findOneEntity(@Request() request){
  return this.subAdminService.findOneSubAdmin(request.params.id)
}

@Override('getManyBase')
async findManyEntities() {
  return this.subAdminService.findAllSubAdmin();
}

@ApiResponse({ type: UserEntity })
@Get('filter/:keyword')
@ApiOperation({ summary: "Delete Sub admin" })
@HttpCode(HttpStatus.OK)
@Roles(RoleEnum.ADMIN)
async filter(@Param('keyword') keyword: string,){
  return this.subAdminService.fiterSubAdmin(keyword)
}

 
  
}
