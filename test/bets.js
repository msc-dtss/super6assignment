const expect = require('chai').expect;
const errors = require('../errors/super6exceptions');
const betsService = require('../services/bets');

// A suite of tests
describe('resolveClientBet', () => {

    // Run before each test in this suite
    beforeEach(() => {
    });


    /**
     * Each element in this list corresponts to a scenario.
     * We will then iterate through them and create an `it` scenario
     * 
     * Here I'm using the elements as the "extra" fields that the function needs to get id of
     */
    [
        {},
        { id: "id" },
        { id: 0 },
        { goldenTry: 2 },
        { games: [
            { ANOTHER: "hello", id: 0, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
            { id: 1, teamATries: 2, teamBTries: 3, gameVictor: "hi" },
            { id: 2, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
            { id: 3, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
            { id: 4, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
            { id: 5, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
        ]},
        { goldenTrys: 2, another: "hi" },
        { goldenTrys: 2, another: "hi" },
    ].forEach((extraFields, i) => {
        it(`[${i}] should clean extra elements`, () => {
            const cleanBet = {
                roundIndex: 0,
                games: [
                    { id: 0, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
                    { id: 1, teamATries: 2, teamBTries: 3, gameVictor: "hi" },
                    { id: 2, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
                    { id: 3, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
                    { id: 4, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
                    { id: 5, teamATries: 0, teamBTries: 0, gameVictor: "hi" },
                ],
                goldenTrySelection: 1,
            };
            const result = {
                roundIndex: 0,
                gameBets: [
                    { id: 0, teamATries: 0, teamBTries: 0, winTeam: "hi" },
                    { id: 1, teamATries: 2, teamBTries: 3, winTeam: "hi" },
                    { id: 2, teamATries: 0, teamBTries: 0, winTeam: "hi" },
                    { id: 3, teamATries: 0, teamBTries: 0, winTeam: "hi" },
                    { id: 4, teamATries: 0, teamBTries: 0, winTeam: "hi" },
                    { id: 5, teamATries: 0, teamBTries: 0, winTeam: "hi" },
                ],
                goldenTry: 1,
            };
            expect(betsService.resolveClientBet(Object.assign(cleanBet, extraFields))).to.deep.equal(result);
        });
    });


    /**
     * Each element in this list corresponts to a scenario.
     * We will then iterate through them and create an `it` scenario
     * 
     * Here I'm using the elements as objects containing the input into the function and the expected output
     */
    [
        { input: null, output: 'No bet!' },
        { input: {}, output: 'Games need to be listed as an array' },
        {
            input: {
                roundIndex: 0,
                games: [],
                goldenTrySelection: 1
            },
            output: 'Each round must have 6 games'
        },
        {
            input: {
                roundIndex: 0,
                games: null,
                goldenTrySelection: 1
            },
            output: 'Games need to be listed as an array'
        },
        {
            input: {
                roundIndex: 0,
                games: 14,
                goldenTrySelection: 1
            },
            output: 'Games need to be listed as an array'
        },
        {
            input: {
                roundIndex: 0,
                games: "",
                goldenTrySelection: 1
            },
            output: 'Games need to be listed as an array'
        },
        {
            input: {
                roundIndex: 0,
                games: "123456",
                goldenTrySelection: 1
            },
            output: 'Games need to be listed as an array'
        },
        {
            input: {
                roundIndex: 'hi',
                games: [1, 2, 3, 4, 5, 6],
                goldenTrySelection: 1
            },
            output: 'Bad round provided'
        },
        {
            input: {
                roundIndex: null,
                games: [1, 2, 3, 4, 5, 6],
                goldenTrySelection: 1
            },
            output: 'Bad round provided'
        },
        {
            input: {
                roundIndex: {},
                games: [1, 2, 3, 4, 5, 6],
                goldenTrySelection: 1
            },
            output: 'Bad round provided'
        },
        {
            input: {
                roundIndex: 0,
                games: [1, 2, 3, 4, 5, 6],
                goldenTrySelection: 1
            },
            output: 'Bad id provided for game'
        },
        {
            input: {
                roundIndex: 0,
                games: [1, 2, 3, 4, 5, 6],
                goldenTrySelection: -1
            },
            output: 'Bad goldenTry provided'
        },
        {
            input: {
                roundIndex: 0,
                games: [1, 2, 3, 4, 5, 6],
                goldenTrySelection: 'hi'
            },
            output: 'Bad goldenTry provided'
        },
        {
            input: {
                roundIndex: 0,
                games: [1, 2, 3, 4, 5, 6],
                goldenTrySelection: null,
            },
            output: 'Bad goldenTry provided'
        },
        {
            input: {
                roundIndex: 0,
                games: [1, 2, 3, 4, 5, 6],
                goldenTrySelection: {},
            },
            output: 'Bad goldenTry provided'
        },
        {
            input: {
                roundIndex: 0,
                games: [{ id: 0 }, 2, 3, 4, 5, 6],
                goldenTrySelection: 0,
            },
            output: 'Bad teamATries provided for game'
        },
        {
            input: {
                roundIndex: 0,
                games: [{ id: 0, teamATries: 0 }, 2, 3, 4, 5, 6],
                goldenTrySelection: 0,
            },
            output: 'Bad teamBTries provided for game'
        },
        {
            input: {
                roundIndex: 0,
                games: [{ id: 0, teamATries: 0, teamBTries: 0, gameVictor: 0 }, 2, 3, 4, 5, 6],
                goldenTrySelection: 0,
            },
            output: 'Bad gameVictor provided for game'
        },
        {
            input: {
                roundIndex: 0,
                games: [{ id: 0, teamATries: 0, teamBTries: 0, gameVictor: 0 }, 2, 3, 4, 5, 6],
                goldenTrySelection: 1,
            },
            output: 'Bad gameVictor provided for game'
        },
        {
            input: {
                roundIndex: 0,
                games: [{ id: 0, teamATries: 0, teamBTries: 0, gameVictor: "" }, 2, 3, 4, 5, 6],
                goldenTrySelection: 1,
            },
            output: 'Bad gameVictor provided for game'
        },
        {
            input: {
                roundIndex: 0,
                games: [{ id: 0, teamATries: 0, teamBTries: 0, gameVictor: "hi" }, 2, 3, 4, 5, 6],
                goldenTrySelection: 1,
            },
            output: 'Bad id provided for game'
        },
        {
            input: {
                roundIndex: 0,
                games: [{ id: 0, teamATries: 0, teamBTries: 0, gameVictor: "hi" }, {}, 3, 4, 5, 6],
                goldenTrySelection: 1,
            },
            output: 'Bad id provided for game'
        },
    ].forEach((params, i) => {
        it(`[${i}] should throw error when missing fields`, () => {
            //For testing errors being thrown, chai need a function, rather than the result of one.
            expect(() => { betsService.resolveClientBet(params.input) }).to.throw(errors.ValidationError, params.output);
        });
    });
});