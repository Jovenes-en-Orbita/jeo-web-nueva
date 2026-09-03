import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateApplicationStatusDto as IUpdateApplicationStatusDto } from '@jeo/shared';

export class UpdateApplicationStatusDto implements IUpdateApplicationStatusDto {
  @ApiProperty({ example: 'REVIEWED', enum: ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'] })
  @IsNotEmpty()
  @IsIn(['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'])
  status!: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
}
