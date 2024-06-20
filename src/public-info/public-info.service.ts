import { Inject, Injectable, Logger } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { PrismaService } from '../common/prisma.service'
import { ValidationService } from '../common/validation.service'
import {
  CreatePublicInfoDtoType,
  createPublicInfoSchema,
} from './dto/create.dto'
import {
  CreateCommentDtoType,
  createCommentSchema,
} from './dto/create-comment.dto'
import { CreateReportDtoType } from './dto/create-report.dto'
import { MulterService } from '../common/multer.service'

@Injectable()
export class PublicInfoService {
  constructor(
    private db: PrismaService,
    private validationService: ValidationService,
    private multerService: MulterService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getPublicInfo() {
    return await this.db.publicInformation.findMany({
      select: {
        publicInformationId: true,
        authorId: true,
        author: {
          select: {
            userId: true,
            username: true,
            fullName: true,
            imageUrl: true,
          },
        },
        latitude: true,
        longitude: true,
        postId: true,
        post: {
          select: {
            postId: true,
            content: true,
            createdAt: true,
            imageUrl: true,
          },
        },
      },
    })
  }

  async getPublicInfoById(publicInformationId: string) {
    return await this.db.publicInformation.findUnique({
      where: {
        publicInformationId,
      },
      select: {
        publicInformationId: true,
        authorId: true,
        author: {
          select: {
            userId: true,
            username: true,
            fullName: true,
            imageUrl: true,
          },
        },
        postId: true,
        post: {
          select: {
            postId: true,
            content: true,
            createdAt: true,
            imageUrl: true,
            comments: {
              select: {
                commentId: true,
                authorId: true,
                author: {
                  select: {
                    userId: true,
                    username: true,
                    fullName: true,
                    imageUrl: true,
                  },
                },
                content: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })
  }

  async createPublicInfo(
    userId: string,
    createPublicInfoDto: CreatePublicInfoDtoType,
    file: Express.Multer.File,
  ) {
    const validatedDto = this.validationService.validate(
      createPublicInfoSchema,
      createPublicInfoDto,
    )

    let imageUrl: string = null
    if (file) {
      imageUrl = await this.multerService.uploadFile(file, file.originalname)
    }

    const post = await this.db.post.create({
      data: {
        authorId: userId,
        content: validatedDto.content,
        imageUrl,
      },
    })

    const publicInfo = await this.db.publicInformation.create({
      data: {
        authorId: userId,
        postId: post.postId,
        latitude: validatedDto.latitude,
        longitude: validatedDto.longitude,
      },
    })

    return publicInfo
  }

  async createComment(
    userId: string,
    createCommentDto: CreateCommentDtoType,
    publicInformationId: string,
  ) {
    const validatedDto = this.validationService.validate(
      createCommentSchema,
      createCommentDto,
    )

    const publicInformation = await this.db.publicInformation.findUnique({
      where: {
        publicInformationId,
      },
    })

    const comment = await this.db.comment.create({
      data: {
        postId: publicInformation.postId,
        authorId: userId,
        content: validatedDto.content,
      },
    })

    return comment
  }

  async reportPublicInfo(
    userId: string,
    createReportDto: CreateReportDtoType,
    publicInformationId: string,
  ) {
    const report = await this.db.report.create({
      data: {
        publicInformationId,
        authorId: userId,
        reason: createReportDto.reason,
      },
    })

    return report
  }
}
