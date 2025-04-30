import { MigrationInterface, QueryRunner } from "typeorm";

// Timestamp: 1745986817822 (Keep your original)
export class CreateCommentTable1745986817822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ONLY Create the comment table structure
        await queryRunner.query(`
            CREATE TABLE "comment" ( -- Use quotes
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL, -- Foreign key added in a later migration
                film_id INTEGER NOT NULL, -- Foreign key added in a later migration
                comment TEXT NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
                -- Foreign Keys are NOT defined here
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ONLY Drop the comment table
        await queryRunner.query(`DROP TABLE IF EXISTS "comment";`); // Use quotes and IF EXISTS
    }
}