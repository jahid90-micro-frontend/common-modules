class EventBus {

    constructor(logger) {
        this.logger = logger.withModule('event-bus');
        this.registered = {};
    }


    emit(event, data) {

        this.logger.debug(`received event: ${event} with payload: ${JSON.stringify(data)}`);

        this.registered[event] && this.registered[event].forEach(cb => {
            cb(data);
        })
    }

    on(event, cb) {
        this.logger.debug(`registering a listener for event: ${event}`);

        this.registered[event] = this.registered[event] || [];
        this.registered[event].push(cb);
    }

    off(event, cb) {
        if (this.registered[event]) {
            const index = this.registered[event].indexOf(cb);
            if (index > -1) {
                this.registered[event].splice(index, 1);
            }
        }
    }

}

export default EventBus;
