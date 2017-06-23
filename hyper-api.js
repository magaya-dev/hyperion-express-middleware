const addon = require('./bin/hyperion');

module.exports = function ({ name, argv }) {
    const api = addon.connect(name, argv);    

    return {
        dbx: api.hyperion,
        algo: new Algorithms(api.async),
        api: api.livetrack,
    };
}

class AsyncBase {
    constructor(asyncApi, cursor) {
        this.async = asyncApi;
        this.cursor = cursor;
    }
}

class ForEachAsync extends AsyncBase  {
    constructor(asyncApi, cursor) {
        super(asyncApi, cursor);
    }

    callback(callbackFunction) {
        return new Promise((resolve, reject) => {
            this.async.forEachAsync(this.cursor, callbackFunction, resolve);
        });
    }
}

class TransformAsync extends AsyncBase  {
    constructor(asyncApi, cursor) {
        super(asyncApi, cursor);
    }

    callback(callbackFunction) {
        return new Promise((resolve, reject) => {
            let result = [];
            this.async.forEachAsync(
                this.cursor,
                (currentObject) => {
                    result.push(callbackFunction(currentObject))
                },
                () => { resolve(result) })
        });
    }
}

class AccumulateAsync extends AsyncBase  {
    constructor(asyncApi, cursor) {
        super(asyncApi, cursor);
    }

    callback(initValue, callbackFunction) {
        return new Promise((resolve, reject) => {
            let result = initValue;
            this.async.forEachAsync(
                this.cursor,
                (currentObject) => {
                    result = callbackFunction(result, currentObject)
                },
                () => { resolve(result) }
            );
        });
    }
}

class CollectAsync extends AsyncBase  {
    constructor(asyncApi, cursor) {
        super(asyncApi, cursor);
    }

    where(predicate) {
        return new Promise((resolve, reject) => {
            let result = [];
            this.async.forEachAsync(
                this.cursor,
                (currentObject) => {
                    if (predicate(currentObject)) {
                        result.push(currentObject);
                    }
                },
                () => { resolve(result) }
            );
        });
    }
}

class AnyOfAsync extends AsyncBase  {
    constructor(asyncApi, cursor) {
        super(asyncApi, cursor);
    }

    where(predicate) {
        return new Promise((resolve, reject) => {
            let predicateResult = false;
            this.async.whileAsync(
                this.cursor,
                (currentObject) => {
                    predicateResult = predicate(currentObject);
                    return !predicateResult;
                },
                () => { resolve(predicateResult) }
            );
        });
    }
}

class AllOfAsync extends AsyncBase  {
    constructor(asyncApi, cursor) {
        super(asyncApi, cursor);
    }

    where(predicate) {
        return new Promise((resolve, reject) => {
            let predicateResult = false;
            this.async.whileAsync(
                this.cursor,
                (currentObject) => {
                    predicateResult = predicate(currentObject);
                    return predicateResult;
                },
                () => { resolve(predicateResult) }
            );
        });
    }
}

class NoneOfAsync extends AsyncBase  {
    constructor(asyncApi, cursor) {
        super(asyncApi, cursor);
    }

    where(predicate) {
        return new Promise((resolve, reject) => {
            let predicateResult = false;
            this.async.whileAsync(
                this.cursor,
                (currentObject) => {
                    predicateResult = predicate(currentObject);
                    return !predicateResult;
                },
                () => { resolve(!predicateResult) }
            );
        });
    }
}

class FindAsync extends AsyncBase  {
    constructor(asyncApi, cursor) {
        super(asyncApi, cursor);
    }

    where(predicate) {
        return new Promise((resolve, reject) => {
            let foundObject;
            this.async.whileAsync(
                this.cursor,
                (currentObject) => {
                    if (predicate(currentObject)) {
                        foundObject = currentObject;
                        return false;
                    }
                    return true;
                },
                () => { resolve(foundObject) }
            );
        });
    }
}

class SelectAsync extends AsyncBase  {
    constructor(asyncApi, cursor, count) {
        super(asyncApi, cursor);
        this.count = count;
        this.predicate = () => true;
    }

    where(predicate) {
        this.predicate = predicate;
        return this;
    }

    project(projectFunction) {        
        return new Promise((resolve, reject) => {
            let result = [];
            this.async.whileAsync(
                this.cursor,
                (currentObject) => {
                    if (this.predicate(currentObject)) {
                        result.push(projectFunction(currentObject));
                    }
                    return result.length < this.count;
                },
                () => { resolve(result) }
            );
        });
    }
}

class StreamAttachmentAsync  {
    constructor(asyncApi, attachment) {
        this.async = asyncApi;
        this.attachment = attachment;
    }

    stream(writeStream) {    
        function writeChunk(resolve, writeStream, data, start) {
            let size = 4 * 1024; 

            if (start == data.length ) {
                resolve();
                return;
            }

            let end = Math.min(start + size, data.length);
            let buffer = data.slice(start, end);

            writeStream.write(buffer);
            process.nextTick(writeChunk, resolve, writeStream, data, end);
        }

        return new Promise((resolve, reject) => {
            this.async.getAttachmentContentAsync(
                this.attachment,
                (data) => {
                    writeChunk(resolve, writeStream, data, 0);
                });
        });
    }
}

function Algorithms(asyncApi) {
    this.forEach = function (cursor) {
        return new ForEachAsync(asyncApi, cursor);
    };

    this.transform = function (cursor) {
        return new TransformAsync(asyncApi, cursor);
    };

    this.accumulate = function (cursor) {
        return new AccumulateAsync(asyncApi, cursor);
    };

    this.anyOf = function (cursor) {
        return new AnyOfAsync(asyncApi, cursor);
    };

    this.allOf = function (cursor) {
        return new AllOfAsync(asyncApi, cursor);
    };

    this.noneOf = function (cursor) {
        return new NoneOfAsync(asyncApi, cursor);
    };

    this.find = function (cursor) {
        return new FindAsync(asyncApi, cursor);
    };

    this.findFirst = function (cursor) {
        return new FindAsync(asyncApi, cursor).where(_ => true);
    };

    this.collect = function (cursor) {
        return new CollectAsync(asyncApi, cursor);
    };

    this.select = function(cursor, count) {
        return new SelectAsync(asyncApi, cursor, count);
    };

    this.streamAttachmentContent = function(attachment, writeStream) {
        return new StreamAttachmentAsync(asyncApi, attachment).stream(writeStream);
    };
}
