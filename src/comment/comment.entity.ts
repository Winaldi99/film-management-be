import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Film } from '../film/film.entity';
  
  @Entity('comment')
  export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    user_id: number;
  
    @Column()
    film_id: number;
  
    @ManyToOne(() => Film)
    @JoinColumn({ name: 'film_id' })
    film: Film;
  
    @Column()
    comment: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  