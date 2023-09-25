process.env.NODE_ENV = "test";

const request = require("supertest");
const {app} = require("./app");

let popsicle = {"name": "popsicle", "price": 1.99}

beforeEach(function() {
    global.items.push(popsicle);
});

afterEach(function() {
    global.items.length = 0;
})

describe("GET /items", function() {
    test("Gets the list of items", async function() {
        const resp = await request(app).get("/items");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([popsicle]);
    });
})

describe("POST /items", function() {
    test("Posts new item to list", async function() {
        const resp = await request(app).post("/items").send({"name":"pineapple","price":4});
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({"added":{"name":"pineapple","price":4}})
    });

    test("Fails when items are missing", async function() {
        const resp = await request(app).post("/items").send("Incorrect data format");
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({"error": "You need to add a name"});
    });
})

describe("GET /items/specific", function() {
    test("Gets the item in search", async function() {
        const resp = await request(app).get("/items").send("popsicle")
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([popsicle]);
    });

    test("Fails when items are missing", async function() {
        const resp = await request(app).get('/items/banana');
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error": "There is nothing in the list matching your input"});
    });
})

describe("DELETE /items/:name", function() {
    test("Deletes specific from global.items", async function() {
        const resp = await request(app).delete("/items/popsicle");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"message":"Deleted"})
        expect(global.items.length).toBe(0);
    })
})

describe("PATCH /items/specific", function() {
    test("Updates popsicles price successfully", async function() {
        const resp = await request(app).patch("/items/popsicle").send({"name": "popsicle", "price":10});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated": {"name": "popsicle", "price":10}});
    })

    test("Updates popsicle name and price", async function() {
        const resp = await request(app).patch("/items/popsicle").send({"name": "popsickle", "price":10});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated": {"name": "popsickle", "price":10}});
    })
})

