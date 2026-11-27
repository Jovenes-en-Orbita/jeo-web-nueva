import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

export interface UploadedObjectResult {
  key: string;
  bucket: string;
  url: string;
  contentType: string;
  size: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client | null;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>("AWS_ENDPOINT_URL_S3");
    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>(
      "AWS_SECRET_ACCESS_KEY",
    );
    const region = this.configService.get<string>("AWS_REGION", "us-east-2");
    this.bucket = this.configService.get<string>("AWS_S3_BUCKET", "assets");

    if (endpoint && accessKeyId && secretAccessKey) {
      this.s3 = new S3Client({
        endpoint,
        region,
        forcePathStyle: true,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } else {
      this.s3 = null;
      this.logger.warn(
        "Neon Object Storage (S3) no está configurado. Define AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY.",
      );
    }
  }

  isConfigured(): boolean {
    return this.s3 !== null;
  }

  private getClientOrThrow(): S3Client {
    if (!this.s3) {
      throw new ServiceUnavailableException(
        "El almacenamiento de objetos (Neon Object Storage) no está configurado en el servidor.",
      );
    }
    return this.s3;
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();
  }

  async uploadBuffer(params: {
    buffer: Buffer;
    originalName: string;
    contentType: string;
    folder?: string;
    signedUrlExpiresIn?: number;
  }): Promise<UploadedObjectResult> {
    const client = this.getClientOrThrow();
    const safeFolder = (params.folder || "uploads").replace(/^\/+|\/+$/g, "");
    const safeName = this.sanitizeFilename(params.originalName || "file");
    const key = `${safeFolder}/${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;

    await client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: params.buffer,
        ContentType: params.contentType,
      }),
    );

    const url = await this.getSignedReadUrl(
      key,
      params.signedUrlExpiresIn ?? 3600,
    );

    return {
      key,
      bucket: this.bucket,
      url,
      contentType: params.contentType,
      size: params.buffer.length,
    };
  }

  async getSignedReadUrl(key: string, expiresIn = 3600): Promise<string> {
    const client = this.getClientOrThrow();
    const trimmedKey = key?.trim();
    if (!trimmedKey) {
      throw new BadRequestException("El parámetro key es obligatorio");
    }

    return getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: trimmedKey,
      }),
      { expiresIn },
    );
  }

  async getPresignedUploadUrl(params: {
    filename: string;
    contentType: string;
    folder?: string;
    expiresIn?: number;
  }): Promise<{
    key: string;
    bucket: string;
    uploadUrl: string;
    readUrl: string;
  }> {
    const client = this.getClientOrThrow();
    const safeFolder = (params.folder || "uploads").replace(/^\/+|\/+$/g, "");
    const safeName = this.sanitizeFilename(params.filename || "file");
    const key = `${safeFolder}/${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;

    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: params.contentType,
      }),
      { expiresIn: params.expiresIn ?? 600 },
    );

    const readUrl = await this.getSignedReadUrl(key, 3600);

    return {
      key,
      bucket: this.bucket,
      uploadUrl,
      readUrl,
    };
  }

  async deleteObject(key: string): Promise<{ success: boolean; key: string }> {
    const client = this.getClientOrThrow();
    const trimmedKey = key?.trim();
    if (!trimmedKey) {
      throw new BadRequestException("El parámetro key es obligatorio");
    }

    await client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: trimmedKey,
      }),
    );

    return { success: true, key: trimmedKey };
  }
}
