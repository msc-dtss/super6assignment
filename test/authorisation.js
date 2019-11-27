const expect = require('chai').expect;
const authorizationLayer = require('../routes/helpers/authorisation');

describe('regexIncludes', () => {
    [
        { list: ["hi"], text: "hi", result: true },
        { list: ["h.*"], text: "hi", result: true },
        { list: ["/hello\/.*", "/goodbye/"], text: "hi", result: false },
        { list: ["/hello\/.*", "/goodbye/"], text: "/hello/", result: true },
        { list: ["/hello\/.*", "/goodbye/"], text: "/hello/bob", result: true },
        { list: ["/hello\/.*", "/goodbye/"], text: "/testing/hello/bob", result: false },
        { list: ["/hello\/.*", "/goodbye/"], text: "/goodbye", result: false },
        { list: ["/hello\/.*", "/goodbye/"], text: "/goodbye/", result: true },
        { list: ["/hello\/.*", "/goodbye/"], text: "/goodbye/bob", result: false },
    ].forEach((t, i) => {
        it(`[${i}] should match the text against the regex in list`, () => {
            expect(authorizationLayer._regexIncludes(t.list, t.text)).to.equal(t.result);
        });
    });
});

describe('isAuthorised', () => {
    [
        { user: null, path: '/', config: { public: ['/'], admin: [] }, result: true },
        { user: null, path: '/admin', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: null, path: '/protected', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: "bad user", path: '/', config: { public: ['/'], admin: [] }, result: true },
        { user: "bad user", path: '/admin', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: "bad user", path: '/protected', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: { firstName: "Good", surname: "User", isActive: true }, path: '/', config: { public: ['/'], admin: [] }, result: true },
        { user: { firstName: "Good", surname: "User", isActive: true }, path: '/admin', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: { firstName: "Good", surname: "User", isActive: true }, path: '/protected', config: { public: ['/'], admin: ['/admin'] }, result: true },
        { user: { firstName: "Inactive", surname: "User" }, path: '/', config: { public: ['/'], admin: [] }, result: true },
        { user: { firstName: "Inactive", surname: "User" }, path: '/admin', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: { firstName: "Inactive", surname: "User" }, path: '/protected', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: { firstName: "Admin", surname: "Inactive User" }, path: '/', config: { public: ['/'], admin: [] }, result: true },
        { user: { firstName: "Admin", surname: "Inactive User" }, path: '/admin', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: { firstName: "Admin", surname: "Inactive User" }, path: '/protected', config: { public: ['/'], admin: ['/admin'] }, result: false },
        { user: { firstName: "Admin", surname: "User", isAdmin: true, isActive: true }, path: '/', config: { public: ['/'], admin: [] }, result: true },
        { user: { firstName: "Admin", surname: "User", isAdmin: true, isActive: true }, path: '/admin', config: { public: ['/'], admin: ['/admin'] }, result: true },
        { user: { firstName: "Admin", surname: "User", isAdmin: true, isActive: true }, path: '/protected', config: { public: ['/'], admin: ['/admin'] }, result: true },
    ].forEach((t, i) => {
        it(`[${i}] should ${t.result ? '' : 'not '}allow access to ${t.path}`, () => {
            expect(authorizationLayer._isAuthorised(t.user, t.path, t.config)).to.equal(t.result);
        });
    });
});