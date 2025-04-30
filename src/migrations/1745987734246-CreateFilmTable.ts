import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFilmTable1745986559054 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "film" (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                director TEXT,
                genre_id INTEGER,
                image_url TEXT,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_film_user
                    FOREIGN KEY(user_id)
                    REFERENCES "users"(id) -- <<< FIX HERE: Change "Users" to "users" (if it wasn't already)
                    ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "film";`);
    }
}