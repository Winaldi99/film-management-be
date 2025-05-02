import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Genre } from '../genre/genre.entity';
  
  @Entity('film')
  export class Film {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    user_id: number;
  
    @Column()
    title: string;
  
    @Column()
    director: string;
  
    @Column()
    genre_id: number;
  
    @ManyToOne(() => Genre)
    @JoinColumn({ name: 'genre_id' })
    genre: Genre;
  
    @Column()
    image_url: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  
  