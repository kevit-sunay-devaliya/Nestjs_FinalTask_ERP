import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';
import { AuthGuard } from '../guards/Auth.guard';
import { AdminAuthorizationGuard } from 'src/guards/Authorization.guard';

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
  updateDepartment(@Param('id') id: string, @Body() body: UpdateDepartmentDto) {
    return this.departmentService.update(id, body);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard, AdminAuthorizationGuard)
  deleteDepartment(@Param('id') id: string) {
    return this.departmentService.delete(id);
  }
}
