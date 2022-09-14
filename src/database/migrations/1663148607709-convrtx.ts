import { MigrationInterface, QueryRunner } from 'typeorm';

export class convrtx1663148607709 implements MigrationInterface {
  name = 'convrtx1663148607709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gw_route_historical_events" DROP CONSTRAINT "FK_bf08ddd9f78d926908d12ebc7e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_statuses" ALTER COLUMN "isActive" SET DEFAULT 'FALSE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_route_clues" ALTER COLUMN "point" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_routes" ALTER COLUMN "start" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_routes" ALTER COLUMN "end" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_route_historical_events" ALTER COLUMN "point" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_treasure_chests" ALTER COLUMN "location" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_route_historical_events" ADD CONSTRAINT "FK_bf08ddd9f78d926908d12ebc7e5" FOREIGN KEY ("route_id") REFERENCES "gw_routes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gw_route_historical_events" DROP CONSTRAINT "FK_bf08ddd9f78d926908d12ebc7e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_treasure_chests" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_route_historical_events" ALTER COLUMN "point" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_routes" ALTER COLUMN "end" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_routes" ALTER COLUMN "start" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_route_clues" ALTER COLUMN "point" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_statuses" ALTER COLUMN "isActive" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_route_historical_events" ADD CONSTRAINT "FK_bf08ddd9f78d926908d12ebc7e5" FOREIGN KEY ("route_id") REFERENCES "gw_routes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
