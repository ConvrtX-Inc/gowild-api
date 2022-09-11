import { MigrationInterface, QueryRunner } from 'typeorm';

export class convrtx1662494948835 implements MigrationInterface {
  name = 'convrtx1662494948835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gw_statuses" ALTER COLUMN "isActive" SET DEFAULT 'FALSE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gw_statuses" ALTER COLUMN "isActive" SET DEFAULT false`,
    );
  }
}
