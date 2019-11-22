const expect = require('chai').expect;
const errors = require('../errors/super6exceptions');
const authorizationLayer = require('../routes/helpers/authorisation');

describe('regexIncludes', () => {
    [
        { list: ["hi"], text: "hi", result: true },
        { list: [/h.*/], text: "hi", result: true },
        { list: [/\/hello\/.*/, /\/goodbye\//], text: "hi", result: false },
        { list: [/\/hello\/.*/, /\/goodbye\//], text: "/hello/", result: true },
        { list: [/\/hello\/.*/, /\/goodbye\//], text: "/hello/bob", result: true },
        { list: [/\/hello\/.*/, /\/goodbye\//], text: "/testing/hello/bob", result: false },
        { list: [/\/hello\/.*/, /\/goodbye\//], text: "/goodbye", result: false },
        { list: [/\/hello\/.*/, /\/goodbye\//], text: "/goodbye/", result: true },
        { list: [/\/hello\/.*/, /\/goodbye\//], text: "/goodbye/bob", result: false },
    ].forEach((t, i) => {
        it(`should match the text against the regex in list ${i}`, () => {
            expect(authorizationLayer._regexIncludes(t.list, t.text)).to.equal(t.result);
        });
    });
});