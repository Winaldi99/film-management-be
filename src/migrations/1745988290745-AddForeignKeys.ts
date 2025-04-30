// Example: src/migration/1745987000000-AddForeignKeys.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForeignKeys1745987000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ... (fk_film_genre constraint added here too) ...

        // Add foreign key from comment to user
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT fk_comment_user -- Unique constraint name
            FOREIGN KEY (user_id)
            REFERENCES "users"(id) -- Correct: lowercase, quoted
            ON DELETE CASCADE;
        `);

        // Add foreign key from comment to film
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT fk_comment_film -- Unique constraint name
            FOREIGN KEY (film_id)
            REFERENCES "film"(id) -- Correct: lowercase, quoted
            ON DELETE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ... (drop fk_film_genre constraint here too) ...
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT IF EXISTS fk_comment_film;`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT IF EXISTS fk_comment_user;`);
    }
}