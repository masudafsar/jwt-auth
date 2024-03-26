import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRefreshTokenRelation1711416214783
  implements MigrationInterface
{
  name = 'CreateUserRefreshTokenRelation1711416214783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "refresh_token"
      ADD "userId" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "refresh_token"
      ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"
    `);
    await queryRunner.query(`
      ALTER TABLE "refresh_token" DROP COLUMN "userId"
    `);
  }
}
