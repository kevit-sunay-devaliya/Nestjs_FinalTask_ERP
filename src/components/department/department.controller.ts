import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';
import { AuthGuard } from '../../utils/guards/Auth.guard';
import { AdminAuthorizationGuard } from '../../utils/guards/Authorization.guard';

@Controller('department')
@UseGuards(AuthGuard, AdminAuthorizationGuard)
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post('/create')
  createDepartment(@Body() body: CreateDepartmentDto) {
    return this.departmentService.create(body);
  }

  // @Get('/:id')
  // getDepartment(@Param('id') id: string) {
  //   return this.departmentService.getDept(id);
  // }

  @Get('/')
  @UseGuards(AuthGuard, AdminAuthorizationGuard)
  getDepartments() {
    return this.departmentService.getDepts();
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard, AdminAuthorizationGuard)
  async updateDepartment(
    @Param('id') id: string,
    @Body() body: UpdateDepartmentDto,
  ) {
    try {
      const department = await this.departmentService.update(id, body);
      if (!department) {
        throw new NotFoundException('NOT FOUND!');
      }
      return department;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard, AdminAuthorizationGuard)
  async deleteDepartment(@Param('id') id: string) {
    try {
      const department = await this.departmentService.delete(id);
      if (!department) {
        throw new NotFoundException('NOT FOUND!');
      }
      return department;
    } catch (error) {
      throw new NotFoundException('NOT FOUND!');
    }
  }
}
