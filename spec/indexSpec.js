const mock = require('mock-require');

describe('Hyperion Express Middleware', function () {
    const moduleName = 'testing';
    const api = 'livetrack';
    const args = ['test1', 'test2'];

    describe('initialization', function () {
        beforeEach(function () {
            mock('@magaya/hyperion-node', function () {
                return undefined;
            });

            this.hyperion = mock.reRequire('../index');
        });

        it('should throw error when missing argumentts', function () {
            expect(() => this.hyperion()).toThrowError(Error, 'invalid args');
        });

        it('should initialize when all arguments are provied', function () {
            const middleware = this.hyperion(args, api);
            expect(middleware).toBeDefined();    // middleware should have been initialized to something
        });

        it('should initialize without api as long as arguments is provided', function () {
            const middleware = this.hyperion(args);
            expect(middleware).toBeDefined();    // middleware should have been initialized to something
        });
    });

    describe('unable to connect to hyperion', function () {
        beforeEach(function () {
            mock('@magaya/hyperion-node', function () {
                return undefined;
            });

            const hyperion = mock.reRequire('../index');
            this.middleware = hyperion(args, api);
        });

        it('should throw error when called', function () {
            var error;

            try {
                this.middleware({}, {}, function () {
                    expect(true).toBe(false);   // This should not be called
                });
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();    // An error should have been thrown
        });
    });

    describe('when connected to hyperion', function () {
        const connection = require('./fakeperion')();

        beforeEach(function () {
            mock('@magaya/hyperion-node', './fakeperion');

            this.hyperion = mock.reRequire('../index');
        });

        it('should populate fields and move on', function () {
            let request = {};
            let movedOn = false;
            const middleware = this.hyperion(args, api);

            middleware(request, {}, function () {
                movedOn = true;   // This should be called
            });

            expect(request.dbx).toEqual(connection.dbx);
            expect(request.algorithm).toEqual(connection.algorithm);
            expect(request.api).toEqual(connection.connection.livetrack);
            expect(movedOn).toBe(true);
        });

        it('should leave api empty when none is provided', function () {
            let request = {};
            let movedOn = false;
            const middleware = this.hyperion(args);

            middleware(request, {}, function () {
                movedOn = true;   // This should be called
            });

            expect(request.dbx).toEqual(connection.dbx);
            expect(request.algorithm).toEqual(connection.algorithm);
            expect(request.api).toBeUndefined();
            expect(movedOn).toBe(true);
        });
    });
});