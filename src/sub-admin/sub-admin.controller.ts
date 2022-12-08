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

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Sub-Admin')
@Controller({
  path: 'sub-admin',
  version: '1',
})
export class SubAdminController {
  constructor(private readonly subAdminService: SubAdminService) {}

  @ApiResponse({ type: UserEntity })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new sub admin' })
  async register(
    @Body() createSubAdminDto: CreateSubAdminDto,
  ): Promise<UserEntity> {
    return this.subAdminService.registerSubAdmin(createSubAdminDto);
  }

  // @ApiResponse({ type: UserEntity })
  // @Post('update/sub-admin')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Register new sub admin' })
  // async updateSubAdmin(
  //   id:string, UpdateUserDto: UpdateUserDto,): Promise<UserEntity>{
  //     return this.subAdminService.updateSubAdmin(id, UpdateUserDto)
  //   }
  
  // @ApiResponse({ type: UserEntity })
  // @Post('update/sub-admin')
  // @ApiOperation({ summary: "Update admin profile" })
  // @HttpCode(HttpStatus.OK)
  // // @Roles(RoleEnum.ADMIN)
  // public async updateSubAdmin(
  //   @Param('id') id: string,
  //     @Request() request: Express.Request,
  //     @Body() dto:UpdateUserDto,
  // ):Promise<UserEntity> {
  //   return this.subAdminService.updateSubAdmin(id, dto);
  // }

  
}
