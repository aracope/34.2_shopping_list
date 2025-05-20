const request = require("supertest");
const fs = require("fs/promises");
const app = require("../app");
const { setDataFile, writeItems } = require("../dataStore");

const TEST_DATA_FILE = "./__tests__/test-data.json";

beforeAll(() => {
  // Redirect dataStore to use test file
  setDataFile(TEST_DATA_FILE);
});

beforeEach(async () => {
  // Reset test data file before each test
  await writeItems([
    { name: "popsicle", price: 1.45 },
    { name: "cheerios", price: 3.4 }
  ]);
});

afterAll(async () => {
  // Cleanup test file
  await fs.unlink(TEST_DATA_FILE);
});

describe("GET /items", () => {
  it("should return all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { name: "popsicle", price: 1.45 },
      { name: "cheerios", price: 3.4 }
    ]);
  });
});

describe("POST /items", () => {
  it("should add a new item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "apple", price: 0.99 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      added: { name: "apple", price: 0.99 }
    });
  });
});

describe("GET /items/:name", () => {
  it("should get item by name", async () => {
    const res = await request(app).get("/items/popsicle");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ name: "popsicle", price: 1.45 });
  });

  it("should return 404 for missing item", async () => {
    const res = await request(app).get("/items/notarealitem");
    expect(res.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", () => {
  it("should update an item", async () => {
    const res = await request(app)
      .patch("/items/popsicle")
      .send({ name: "fudgesicle", price: 2.0 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "fudgesicle", price: 2.0 }
    });
  });

  it("should return 404 for updating missing item", async () => {
    const res = await request(app)
      .patch("/items/notfound")
      .send({ name: "nope" });

    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  it("should delete an item", async () => {
    const res = await request(app).delete("/items/popsicle");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });

  it("should return 404 for deleting missing item", async () => {
    const res = await request(app).delete("/items/ghost");
    expect(res.statusCode).toBe(404);
  });
});
