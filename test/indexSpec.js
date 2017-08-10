const mock = require('mock-require');

describe('Hyperion Express Middleware', function () {
    const moduleName = 'testing';
    const args = ['test1', 'test2'];

    describe('initialization', function () {
        beforeEach(function () {
            mock('hyperion-node', function () {
                return undefined;
            });

            this.hyperion = mock.reRequire('../index');
        });

        it('should throw error when no name is provided', function () {
            var error;

            try {
                const middleware = this.hyperion(undefined, args);
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();    // An error should have been thrown
        });

        it('should throw error when empty name is provided', function () {
            var error;

            try {
                const middleware = this.hyperion('', args);
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();    // An error should have been thrown
        });

        it('should initialize when both name and arguments are provied', function () {
            const middleware = this.hyperion(moduleName, args);
            expect(middleware).toBeDefined();    // middleware should have been initialized to something
        });

        it('should initialize without arguments as long as name is provided', function () {
            const middleware = this.hyperion(moduleName);
            expect(middleware).toBeDefined();    // middleware should have been initialized to something
        });
    });

    describe('unable to connect to hyperion', function () {
        beforeEach(function () {
            mock('hyperion-node', function () {
                return undefined;
            });

            const hyperion = mock.reRequire('../index');
            this.middleware = hyperion(moduleName, args);
        });

        it('should throw error when called', function () {
            var error;

            try {
                this.iddleware({}, {}, function () {
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
            mock('hyperion-node', './fakeperion');

            const hyperion = mock.reRequire('../index');
            this.middleware = hyperion(moduleName, args);
        });

        it('should populate fields and move on', function () {
            var request = {};

            this.middleware(request, {}, function () {
                expect(true).toBe(true);   // This should be called
            });

            expect(request.dbx).toEqual(connection.dbx);
            expect(request.algorithm).toEqual(connection.algorithm);
            expect(request.api).toEqual(connection.connection.livetrack);
        });
    });
});