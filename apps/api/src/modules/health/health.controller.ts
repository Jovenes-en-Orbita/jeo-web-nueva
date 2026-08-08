import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar el estado de salud de la API' })
  @ApiResponse({ status: 200, description: 'La API está respondiendo correctamente' })
  check() {
    return { status: 'ok' };
  }
}

