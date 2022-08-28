import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from '@/module/app/controller/app.controller'
import { Module } from '@nestjs/common'
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { configuration } from '@/config'
import { PostModule } from '../post/post.module'
import path from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({
  imports: [
    // Load Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),

    // Load TypeORM Module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',

          host: configService.get('db.host'),
          port: configService.get<number>('db.port'),
          username: configService.get('db.user'),
          password: configService.get('db.password'),
          database: configService.get('db.name'),
          charset: configService.get('db.collation'),

          namingStrategy: new SnakeNamingStrategy(),
          synchronize: true,
          entities: [path.join(__dirname, '../../**/entity/**/*{.ts,.js}')],
          multipleStatements: true
        }
      }
    }),

    // Load Serve Static Module
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../../../', 'public'),
      serveRoot: '/demo'
    }),

    // Load Post Module
    PostModule
  ],

  controllers: [AppController]
})
export class AppModule {}
