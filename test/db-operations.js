const expect = require('chai').expect;
const dbOps = require('../super6db/db-operations');
const errors = require('../errors/super6exceptions');

describe('toMongoDBString', () => {
    [
        { params: ["localhost", 1111, "user", "pass", "db"], result: "mongodb://user:pass@localhost:1111/db" },
        { params: ["localhost", 1111], result: "mongodb://localhost:1111" },
        { params: ["localhost", 1111, "user"], result: "mongodb://localhost:1111" },
        { params: ["localhost", 1111, "user", null], result: "mongodb://localhost:1111" },
        { params: ["localhost", 1111, null, "pass"], result: "mongodb://localhost:1111" },
        { params: ["localhost", 1111, null, null], result: "mongodb://localhost:1111" },
        { params: ["localhost", 1111, null, null, "db"], result: "mongodb://localhost:1111" },
        { params: ["localhost", 1111, "user", "pass"], result: "mongodb://user:pass@localhost:1111" },
    ].forEach((t, i) => {
        it(`[${i}] should generate a mongodb connection string`, () => {
            expect(dbOps._toMongoDBString(...t.params)).to.equal(t.result);
        });
    });

    [
        { params: [null, null, "user", "pass", "db"], result: "mongodb://user:pass@:0/db" },
        { params: [null, 1111, "user", "pass", "db"], result: "mongodb://user:pass@:0/db" },
        { params: ["localhost", null, "user", "pass", "db"], result: "mongodb://user:pass@:0/db" },
    ].forEach((t, i) => {
        it(`[${i}] shouild throw an error when missing host amd/or port`, () => {
            expect(()=>{dbOps._toMongoDBString(...t.params)}).to.throw(errors.ValidationError);
        });
    });
});