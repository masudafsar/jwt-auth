import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokenTable1711416071760
  implements MigrationInterface
{
  name = 'CreateRefreshTokenTable1711416071760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "refresh_token" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying NOT NULL,
        "title" character varying,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "revoked_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "UQ_c31d0a2f38e6e99110df62ab0af" UNIQUE ("token"),
        CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "refresh_token"
    `);
  }
}
