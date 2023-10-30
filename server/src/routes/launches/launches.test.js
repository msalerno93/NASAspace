const request = require("supertest");
const app = require("../../app.js");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo.js");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect()
  })

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launch", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-296 f",
      launchDate: "January 5, 2067",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-296 f",
    };

    const launchDateWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-296 f",
      launchDate: "zebra",
    };

    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch information!",
      });
    });
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDateWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date!",
      });
    });
  });
});
