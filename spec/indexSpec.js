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

        it('should throw error when no name is provided', function () {
            let error;

            try {
                const middleware = this.hyperion(undefined, api, args);
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();    // An error should have been thrown
        });

        it('should throw error when empty name is provided', function () {
            let error;

            try {
                const middleware = this.hyperion('', api, args);
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();    // An error should have been thrown
        });

        it('should initialize when all arguments are provied', function () {
            const middleware = this.hyperion(moduleName, api, args);
            expect(middleware).toBeDefined();    // middleware should have been initialized to something
        });

        it('should initialize without arguments as long as name and apie are provided', function () {
            const middleware = this.hyperion(moduleName, api);
            expect(middleware).toBeDefined();    // middleware should have been initialized to something
        });

        it('should initialize without api or arguments as long as name is provided', function () {
            const middleware = this.hyperion(moduleName);
            expect(middleware).toBeDefined();    // middleware should have been initialized to something
        });
    });

    describe('unable to connect to hyperion', function () {
        beforeEach(function () {
            mock('@magaya/hyperion-node', function () {
                return undefined;
            });

            const hyperion = mock.reRequire('../index');
            this.middleware = hyperion(moduleName, api, args);
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
            const middleware = this.hyperion(moduleName, api, args);

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
            const middleware = this.hyperion(moduleName);

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