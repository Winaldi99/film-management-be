import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentTable1745986817822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE reviews (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                film_id INTEGER NOT NULL,
                comment TEXT NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
                CONSTRAINT fk_user
                    FOREIGN KEY(user_id) 
                    REFERENCES Users(id)
                    ON DELETE CASCADE,
                    
                CONSTRAINT fk_book
                    FOREIGN KEY(film_id) 
                    REFERENCES film(id)
                    ON DELETE CASCADE
            );
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE comment;`)

    }

}
