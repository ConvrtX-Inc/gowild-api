import { MigrationInterface, QueryRunner } from 'typeorm';

export class convrtx1662492683416 implements MigrationInterface {
  name = 'convrtx1662492683416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gw_refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "refresh_token_id" character varying NOT NULL, "refresh_token_hashed" text NOT NULL, "meta_data" text, "status" character varying NOT NULL, CONSTRAINT "UQ_dd51113c38c443ce10bf22ec737" UNIQUE ("refresh_token_id"), CONSTRAINT "PK_ae4a9750c6b87fd62e2ee25d135" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "postfeed_id" uuid NOT NULL, "message" character varying, CONSTRAINT "PK_7d6aa7ffc88d4e79b894f8cf2df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying NOT NULL, "name" character varying, "namePlural" character varying, "symbol" character varying, CONSTRAINT "PK_d30434946bb7fe25ebd046f1976" PRIMARY KEY ("id", "code"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "path" character varying NOT NULL, "size" integer NOT NULL, "mimetype" character varying NOT NULL, "file_name" character varying, "meta_data" text, CONSTRAINT "PK_8ce9c0a2a10892ce832c250183c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status_name" character varying NOT NULL, "isActive" boolean DEFAULT 'FALSE', CONSTRAINT "UQ_d7a8a7dfe4b431e8ea1af544fcc" UNIQUE ("status_name"), CONSTRAINT "PK_f4444c55380c5d088aa2fd64e19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_user_passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "hashedValue" character varying NOT NULL, "algorithm" character varying NOT NULL, "metaData" text, "status" character varying NOT NULL DEFAULT 'false', "user_id" uuid, CONSTRAINT "PK_cc0192d24da1c6879ccf023be27" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_password_user_by_status" ON "gw_user_passwords" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "first_name" character varying, "last_name" character varying, "birthDate" TIMESTAMP, "gender" character varying, "username" character varying, "email" character varying, "phoneNo" character varying, "hash" character varying, "picture_id" uuid, "status_id" uuid NOT NULL, CONSTRAINT "UQ_09e260daaac2dc9fda1ed39e162" UNIQUE ("username"), CONSTRAINT "UQ_bbfc282a92ebd13a64ed4d491bc" UNIQUE ("email"), CONSTRAINT "PK_73ab1b244fc6b9008bcf2e2085c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_forgot_passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "hash" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_8a7707dab7dfee5c9121deac650" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b0acac120f8277730d6a79528" ON "gw_forgot_passwords" ("hash") `,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_friends" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "friend_id" uuid NOT NULL, "is_approved" boolean NOT NULL, CONSTRAINT "PK_c08948de7a679ca0403ccc05192" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_guideline_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" uuid NOT NULL, "guideline_type" text, CONSTRAINT "PK_e0aa9f3fbe6258561cc576fe87c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_guidelines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" text, "description" text, "last_updated_user" uuid, CONSTRAINT "UQ_87e425c03931df241db51f136e8" UNIQUE ("type"), CONSTRAINT "PK_a3ab93af734bbd461dd5dde4959" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "postfeed_id" uuid NOT NULL, CONSTRAINT "PK_2f36237442189c1edd7175662dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "room_id" character varying, "user_id" character varying, "message" text NOT NULL, CONSTRAINT "PK_e8939d079f7419f922c39f3dca8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying, "room_id" character varying, CONSTRAINT "PK_38f2fb3d6ac9cc5b9a825b8bbc5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "type" character varying(100) NOT NULL, CONSTRAINT "PK_68ea0cbe45cd785730babf1b158" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying, "notification_msg" character varying(100), CONSTRAINT "PK_ad01d1f5d842e0cacd373af6822" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_post_feeds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "title" character varying(100), "description" character varying, "img" bytea, "is_published" boolean NOT NULL, "views" integer NOT NULL, CONSTRAINT "PK_4bdde54bf1ffb514ea1d11fd74e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_cc08134a96e2acb247ae253c86a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_route_clues" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "route_id" uuid NOT NULL, "location_point_long" numeric(8,4), "location_point_lat" numeric(8,4), "clue_point_long" numeric(8,4), "clue_point_lat" numeric(8,4), "clue_title" character varying(50), "description" character varying, "clue_img" bytea, "video_url" character varying, "ar_clue" character varying, CONSTRAINT "PK_aa08fd15ee32727a46f98976df0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_route_historical_event_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "route_historical_event_id" uuid NOT NULL, "event_photo_url" text, CONSTRAINT "PK_b00387261d66ee56aec1c068bbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_route_historical_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "route_id" uuid NOT NULL, "closure_uid" character varying(50), "event_long" numeric(8,4), "event_lat" numeric(8,4), "event_title" character varying(50), "event_subtitle" character varying(50), "description" character varying, CONSTRAINT "PK_afec604b4d8e38b364d790cb824" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_routes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "route_name" character varying(50), "route_photo" bytea, "start_point_long" numeric(8,4) DEFAULT '0', "start_point_lat" numeric(8,4) DEFAULT '0', "stop_point_long" numeric(8,4) DEFAULT '0', "stop_point_lat" numeric(8,4) DEFAULT '0', "img_url" text, "description" text NOT NULL, CONSTRAINT "PK_374c866d257323de49a718a82fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_shares" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "postfeed_id" uuid NOT NULL, "url" text DEFAULT 'www.gowild.com', CONSTRAINT "PK_376f51bc946c5d70e53d474d7d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_social_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" character varying, "description" character varying(100), "accountEmail" character varying(100), "socialId" character varying(100), "provider" character varying(100), CONSTRAINT "PK_a51ea077ba497f9aa70c37ef937" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_sponsors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "treasure_chest_id" uuid NOT NULL, "img_url" text, "img" bytea, "link" text NOT NULL DEFAULT 'link', CONSTRAINT "PK_fd8c1a0afe6fb301da7c49b097c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_system_support_attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "sys_support_id" character varying, "attachment" bytea, CONSTRAINT "PK_fd69860ff3958c8f4109dddf2fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_system_supports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying, "status_id" character varying, "message" character varying, CONSTRAINT "PK_04ecbe00d8486c876fbe2915da2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_ticket_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "ticket_id" uuid NOT NULL, "user_id" uuid NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_696868b27b362a212a34edb2f01" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "subject" character varying(50), "message" text NOT NULL, "img_url" text, "status" integer NOT NULL, CONSTRAINT "PK_92a49334ba9a3e24b88e2aedbc1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gw_treasure_chests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying(50) NOT NULL, "description" character varying NOT NULL, "location_long" numeric(8,4) NOT NULL, "location_lat" numeric(8,4) NOT NULL, "eventDate" TIMESTAMP NOT NULL, "event_time" character varying NOT NULL, "no_of_participants" integer NOT NULL, "img_url" text, "thumbnail_img" bytea, "a_r" character varying, CONSTRAINT "PK_6a36eca64d88ce73beb44ee7848" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_user_passwords" ADD CONSTRAINT "FK_fe9edf9e65396bdfaba6ad287c3" FOREIGN KEY ("user_id") REFERENCES "gw_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_users" ADD CONSTRAINT "FK_cb447b20504b63f471790645a22" FOREIGN KEY ("picture_id") REFERENCES "gw_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_users" ADD CONSTRAINT "FK_b3669c5cb7b08709ad588ac5054" FOREIGN KEY ("status_id") REFERENCES "gw_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_forgot_passwords" ADD CONSTRAINT "FK_1c4469eb9305234789dca20ea99" FOREIGN KEY ("userId") REFERENCES "gw_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gw_forgot_passwords" DROP CONSTRAINT "FK_1c4469eb9305234789dca20ea99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_users" DROP CONSTRAINT "FK_b3669c5cb7b08709ad588ac5054"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_users" DROP CONSTRAINT "FK_cb447b20504b63f471790645a22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gw_user_passwords" DROP CONSTRAINT "FK_fe9edf9e65396bdfaba6ad287c3"`,
    );
    await queryRunner.query(`DROP TABLE "gw_treasure_chests"`);
    await queryRunner.query(`DROP TABLE "gw_tickets"`);
    await queryRunner.query(`DROP TABLE "gw_ticket_messages"`);
    await queryRunner.query(`DROP TABLE "gw_system_supports"`);
    await queryRunner.query(`DROP TABLE "gw_system_support_attachments"`);
    await queryRunner.query(`DROP TABLE "gw_sponsors"`);
    await queryRunner.query(`DROP TABLE "gw_social_accounts"`);
    await queryRunner.query(`DROP TABLE "gw_shares"`);
    await queryRunner.query(`DROP TABLE "gw_routes"`);
    await queryRunner.query(`DROP TABLE "gw_route_historical_events"`);
    await queryRunner.query(`DROP TABLE "gw_route_historical_event_photos"`);
    await queryRunner.query(`DROP TABLE "gw_route_clues"`);
    await queryRunner.query(`DROP TABLE "gw_roles"`);
    await queryRunner.query(`DROP TABLE "gw_post_feeds"`);
    await queryRunner.query(`DROP TABLE "gw_notifications"`);
    await queryRunner.query(`DROP TABLE "gw_rooms"`);
    await queryRunner.query(`DROP TABLE "gw_participants"`);
    await queryRunner.query(`DROP TABLE "gw_messages"`);
    await queryRunner.query(`DROP TABLE "gw_likes"`);
    await queryRunner.query(`DROP TABLE "gw_guidelines"`);
    await queryRunner.query(`DROP TABLE "gw_guideline_logs"`);
    await queryRunner.query(`DROP TABLE "gw_friends"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b0acac120f8277730d6a79528"`,
    );
    await queryRunner.query(`DROP TABLE "gw_forgot_passwords"`);
    await queryRunner.query(`DROP TABLE "gw_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_password_user_by_status"`,
    );
    await queryRunner.query(`DROP TABLE "gw_user_passwords"`);
    await queryRunner.query(`DROP TABLE "gw_statuses"`);
    await queryRunner.query(`DROP TABLE "gw_files"`);
    await queryRunner.query(`DROP TABLE "gw_currencies"`);
    await queryRunner.query(`DROP TABLE "gw_comments"`);
    await queryRunner.query(`DROP TABLE "gw_refresh_tokens"`);
  }
}
