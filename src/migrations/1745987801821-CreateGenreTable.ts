import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGenreTable1745986308437 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "genre" (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                category VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_genre_user
                    FOREIGN KEY(user_id)
                    REFERENCES "users"(id) -- <<< FIX HERE: Change "Users" to "users"
                    ON DELETE CASCADE
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "genre";`);
    }
}