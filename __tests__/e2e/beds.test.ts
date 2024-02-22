import type { Server } from "http";
import request from "supertest";

import { BED_GROWING_TIMEOUT } from "../../src/common/constants";
import { CropEnum, type Bed } from "../../src/entities/bed";
import {
  clearDatabase,
  closeDatabase,
  createAuthenticatedAgent,
  createTestServer,
} from "../utils/testsHelpers";

let server: Server;

beforeAll(async () => {
  server = await createTestServer();
});

afterAll(async () => {
  await closeDatabase();
  server.close();
});

describe("Beds routes", () => {
  afterEach(async () => {
    await clearDatabase();
  });

  test("Send beds for authenticated user", async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.get("/api/beds/");

    const beds: Bed[] = res.body;

    expect(res.statusCode).toEqual(200);
    expect(beds).toHaveLength(10);
  });

  test("Throw an error if not authenticated user tries to get beds", async () => {
    const res = await request(server).get("/api/beds/");

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("User is not authentificated");
  });

  test("Harvest a bed if user is authentificated, the bed will not be ready", async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const bedsResponse = await agent.get("/api/beds/");

    const beds: Bed[] = bedsResponse.body;

    const bedIsNotReady = beds.find(
      (bed: Bed) =>
        bed.plantedAt === null ||
        new Date(bed.plantedAt).getTime() + BED_GROWING_TIMEOUT > Date.now(),
    );

    if (bedIsNotReady) {
      const res = await agent
        .post("/api/beds/harvest")
        .send({ index: bedIsNotReady.index });

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toEqual("Bed is not ready");
    }
  });

  test("Harvest a bed if user is authentificated, the bed will be ready", async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const bedsResponse = await agent.get("/api/beds/");

    const beds: Bed[] = bedsResponse.body;

    const bedIsReady = beds.find(
      (bed: Bed) =>
        bed.plantedAt !== null &&
        new Date(bed.plantedAt).getTime() + BED_GROWING_TIMEOUT < Date.now(),
    );

    if (bedIsReady) {
      const res = await agent
        .post("/api/beds/harvest")
        .send({ index: bedIsReady.index });

      expect(res.statusCode).toEqual(200);
    }
  });

  test("Throw an error if not authentificated user tries to harvest bed", async () => {
    const res = await request(server).post("/api/beds/harvest");

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("User is not authentificated");
  });

  test("Plant a bed if user is authentificated, bed is empty", async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const bedsResponse = await agent.get("/api/beds/");

    const beds: Bed[] = bedsResponse.body;

    const emptyBed = beds.find((bed: Bed) => bed.crop === null);

    if (emptyBed) {
      const res = await agent
        .post("/api/beds/plant")
        .send({ index: emptyBed.index, crop: CropEnum.Beet });

      expect(res.statusCode).toEqual(200);
    }
  });

  test("Harvest a bed if user is authentificated, bed is not empty", async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const bedsResponse = await agent.get("/api/beds/");

    const beds: Bed[] = bedsResponse.body;

    const notEmptyBed = beds.find((bed: Bed) => bed.crop !== null);

    if (notEmptyBed) {
      const res = await agent
        .post("/api/beds/plant")
        .send({ index: notEmptyBed.index, crop: CropEnum.Beet });

      expect(res.statusCode).toEqual(409);
    }
  });

  test.todo("After plant or harvest crop balance must grow");

  test("Throw an error if not authentificated user tries to plant bed", async () => {
    const res = await request(server).post("/api/beds/plant");

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("User is not authentificated");
  });
});
