import { Module } from '@nestjs/common';
import { FilmService } from './film.service'; // <-- Ganti nama file & class service
import { FilmController } from './film.controller'; // <-- Ganti nama file & class controller
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './film.entity'; // <-- Ganti nama file & class entity
import { GenreModule } from '../genre/genre.module'; // <-- Ganti nama module terkait

@Module({
  providers: [FilmService], // <-- Ganti provider
  imports: [
    TypeOrmModule.forFeature([Film]), // <-- Ganti entity
    GenreModule // <-- Gunakan module yang sudah diubah namanya
  ],
  controllers: [FilmController], // <-- Ganti controller
  exports: [FilmService] // <-- Ganti export service
})
export class FilmModule {} // <-- Ganti nama class module