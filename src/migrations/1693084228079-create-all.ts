import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAll1693084228079 implements MigrationInterface {
  name = 'CreateAll1693084228079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."goal_team_enum" AS ENUM('home', 'away')`,
    );
    await queryRunner.query(
      `CREATE TABLE "goal" ("id" SERIAL NOT NULL, "minute" integer NOT NULL, "team" "public"."goal_team_enum" NOT NULL, "valid" boolean NOT NULL DEFAULT true, "playerId" integer, "assistId" integer, "gameId" integer, CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offside" ("id" SERIAL NOT NULL, "minute" integer NOT NULL, "playerId" integer, "gameId" integer, CONSTRAINT "PK_c9117a38c1c6cae302bff998ad1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "scheduledTime" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "league" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_0bd74b698f9e28875df738f7864" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "match" ("id" SERIAL NOT NULL, "homeTeamScore" integer NOT NULL DEFAULT '0', "awayTeamScore" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "homeTeamId" integer, "awayTeamId" integer, "leagueId" integer, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "elo" integer NOT NULL DEFAULT '1000', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "birthDate" TIMESTAMP NOT NULL, "position" character varying NOT NULL, "elo" integer NOT NULL DEFAULT '1000', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "teamId" integer, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."foul_card_enum" AS ENUM('', 'yellow', 'red')`,
    );
    await queryRunner.query(
      `CREATE TABLE "foul" ("id" SERIAL NOT NULL, "card" "public"."foul_card_enum" NOT NULL DEFAULT '', "minute" integer NOT NULL, "offendingPlayerId" integer, "victimPlayerId" integer, "gameId" integer, CONSTRAINT "PK_8beafbaf8a6fd661a373314d775" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game_home_team_player" ("gameId" integer NOT NULL, "playerId" integer NOT NULL, CONSTRAINT "PK_49979ed9e6877fc61352fc9eea5" PRIMARY KEY ("gameId", "playerId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96f96c85e27695320e7706dc94" ON "game_home_team_player" ("gameId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9c50d0f631f42d15451279593" ON "game_home_team_player" ("playerId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "game_away_team_player" ("gameId" integer NOT NULL, "playerId" integer NOT NULL, CONSTRAINT "PK_d280c2be6d5d4c294c94c1eb3fa" PRIMARY KEY ("gameId", "playerId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3447002620467598c4a55d5b0" ON "game_away_team_player" ("gameId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_377ab8ad2ec7b95e2153cd788a" ON "game_away_team_player" ("playerId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD CONSTRAINT "FK_285e792996a88665a0049ddf095" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD CONSTRAINT "FK_d9e8a5a3d379a14ef3bdb51add5" FOREIGN KEY ("assistId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD CONSTRAINT "FK_fd8dad3a19135bd936a42bb3eb9" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offside" ADD CONSTRAINT "FK_7de2f74ae342d56e528f7304b1c" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offside" ADD CONSTRAINT "FK_9459d3cc0353fa9e7156ec9d7a2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_5caac1768e2f5b7b9c69b62090c" FOREIGN KEY ("homeTeamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_07f5b02809e195be415834ed78a" FOREIGN KEY ("awayTeamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_96c1ded1c8c70d8bf2f9d486b38" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "foul" ADD CONSTRAINT "FK_6bb16bae9bf60cdd1811e903fb8" FOREIGN KEY ("offendingPlayerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "foul" ADD CONSTRAINT "FK_6886d1280088ac774f53c91eb34" FOREIGN KEY ("victimPlayerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "foul" ADD CONSTRAINT "FK_416b7c44a2422ea6ee685962be2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_home_team_player" ADD CONSTRAINT "FK_96f96c85e27695320e7706dc943" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_home_team_player" ADD CONSTRAINT "FK_a9c50d0f631f42d154512795939" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_away_team_player" ADD CONSTRAINT "FK_e3447002620467598c4a55d5b04" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_away_team_player" ADD CONSTRAINT "FK_377ab8ad2ec7b95e2153cd788a9" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_away_team_player" DROP CONSTRAINT "FK_377ab8ad2ec7b95e2153cd788a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_away_team_player" DROP CONSTRAINT "FK_e3447002620467598c4a55d5b04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_home_team_player" DROP CONSTRAINT "FK_a9c50d0f631f42d154512795939"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_home_team_player" DROP CONSTRAINT "FK_96f96c85e27695320e7706dc943"`,
    );
    await queryRunner.query(
      `ALTER TABLE "foul" DROP CONSTRAINT "FK_416b7c44a2422ea6ee685962be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "foul" DROP CONSTRAINT "FK_6886d1280088ac774f53c91eb34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "foul" DROP CONSTRAINT "FK_6bb16bae9bf60cdd1811e903fb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player" DROP CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_96c1ded1c8c70d8bf2f9d486b38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_07f5b02809e195be415834ed78a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_5caac1768e2f5b7b9c69b62090c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offside" DROP CONSTRAINT "FK_9459d3cc0353fa9e7156ec9d7a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offside" DROP CONSTRAINT "FK_7de2f74ae342d56e528f7304b1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" DROP CONSTRAINT "FK_fd8dad3a19135bd936a42bb3eb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" DROP CONSTRAINT "FK_d9e8a5a3d379a14ef3bdb51add5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" DROP CONSTRAINT "FK_285e792996a88665a0049ddf095"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_377ab8ad2ec7b95e2153cd788a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e3447002620467598c4a55d5b0"`,
    );
    await queryRunner.query(`DROP TABLE "game_away_team_player"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a9c50d0f631f42d15451279593"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96f96c85e27695320e7706dc94"`,
    );
    await queryRunner.query(`DROP TABLE "game_home_team_player"`);
    await queryRunner.query(`DROP TABLE "foul"`);
    await queryRunner.query(`DROP TYPE "public"."foul_card_enum"`);
    await queryRunner.query(`DROP TABLE "player"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "match"`);
    await queryRunner.query(`DROP TABLE "league"`);
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP TABLE "offside"`);
    await queryRunner.query(`DROP TABLE "goal"`);
    await queryRunner.query(`DROP TYPE "public"."goal_team_enum"`);
  }
}
