import type { Server } from "http";
import request from "supertest";

import type { Product } from "../../src/entities/product";
import type { User } from "../../src/entities/user";
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

describe("Products routes", () => {
  afterEach(async () => {
    await clearDatabase();
  });

  test("Get products for authentificated user", async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.get("/api/products/");

    const products: Product[] = res.body;

    expect(res.statusCode).toEqual(200);
    expect(products).toHaveLength(4);
  });

  test("Throw an error if not authentificated user tries to get tasks", async () => {
    const res = await request(server).get("/api/products/");

    expect(res.statusCode).toEqual(401);
  });

  test("Throw an error if not authentificated user tries to purchase a product", async () => {
    const res = await request(server).post("/api/products/purchase");

    expect(res.statusCode).toEqual(401);
  });

  test("Authentificated user purchase a product but id is not provided", async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post("/api/products/purchase");

    expect(res.statusCode).toEqual(400);
  });

  test("Authentificated user purchase a product but id is not uuid", async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post("/api/products/purchase").send({ id: "123" });

    expect(res.statusCode).toEqual(400);
  });

  test("Throw an error if authentificated user tries to purchase a product but ballance is insufficient", async () => {
    const { agent, user } = await createAuthenticatedAgent(server);

    const res = await agent.get("/api/products/");

    const products: Product[] = res.body;

    const availableProducts = products.filter(
      (item) => item.price > user.ballance,
    );

    if (availableProducts.length > 0) {
      const res = await agent
        .post("/api/products/purchase")
        .send({ id: availableProducts[0].id });

      expect(res.statusCode).toEqual(400);
    }
  });

  test("Authentificated user purchase a product ballance is sufficient", async () => {
    const { agent, user } = await createAuthenticatedAgent(server);

    const res = await agent.get("/api/products/");

    const products: Product[] = res.body;

    const availableProducts = products.filter(
      (item) => item.price <= user.ballance,
    );

    if (availableProducts.length > 0) {
      const res = await agent
        .post("/api/products/purchase")
        .send({ id: availableProducts[0].id });

      expect(res.statusCode).toEqual(200);
    }
  });

  test("After purchasing the product, the ballance changes", async () => {
    const { agent, user } = await createAuthenticatedAgent(server);

    const res = await agent.get("/api/products/");

    const products: Product[] = res.body;

    const availableProducts = products.filter(
      (item) => item.price <= user.ballance,
    );

    if (availableProducts.length > 0) {
      await agent
        .post("/api/products/purchase")
        .send({ id: availableProducts[0].id });

      const res = await agent.get("/api/users");
      const ballanceAfterPurchase = (res.body as User).ballance;

      expect(res.statusCode).toEqual(200);
      expect(user.ballance - ballanceAfterPurchase).toBe(
        availableProducts[0].price,
      );
    }
  });

  test("After purchasing the product, it appears in user available products list", async () => {
    const { agent, user } = await createAuthenticatedAgent(server);

    const res = await agent.get("/api/products/");

    const products: Product[] = res.body;

    const availableProducts = products.filter(
      (item) => item.price <= user.ballance,
    );

    if (availableProducts.length > 0) {
      await agent
        .post("/api/products/purchase")
        .send({ id: availableProducts[0].id });

      const res = await agent.get("/api/users");
      const productsAfterPurchase = (res.body as User).products;

      expect(res.statusCode).toEqual(200);
      expect(productsAfterPurchase).toHaveLength(1);
      expect(productsAfterPurchase).toContainEqual(availableProducts[0]);
    }
  });
});
