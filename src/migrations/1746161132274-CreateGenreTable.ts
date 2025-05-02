import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGenreTable1746161132274 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE genre (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
                CONSTRAINT fk_user
                    FOREIGN KEY(user_id) 
                    REFERENCES Users(id)
                    ON DELETE CASCADE
            );
          `);
          await queryRunner.query(`
            ALTER TABLE film
            ADD CONSTRAINT fk_genre
            FOREIGN KEY (genre_id)
            REFERENCES genre(id)
            ON DELETE SET NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE film
            DROP CONSTRAINT IF EXISTS fk_genre;
        `);
        
        await queryRunner.query(`DROP TABLE genre;`);
    }

}
