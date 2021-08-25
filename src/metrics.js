import Events from './events';

class Metrics {
    constructor(logger, eventBus) {
        this.logger = logger.withModule('metrics');
        this.eventBus = eventBus;

        this.counters = {};
        this.traces = {};
        this.dimensions = {};

        // publish metrics every 1 min
        setInterval(this.publish.bind(this), 60*1000);
    }

    publish() {

        this.logger.debug('publishing metrics collected so far');

        for (const [metric, count] of Object.entries(this.counters)) {
            // TODO: submit to metrics publishing endpoint
            this.logger.info(`Count: ${metric}=${count}`);
        }

        for (const [metric, time] of Object.entries(this.traces)) {
            // TODO: submit to metrics publishing endpoint
            this.logger.info(`Time: ${metric}=${time.join(',')}`);
        }

        for (const [metric, values] of Object.entries(this.dimensions)) {
            // TODO: submit to metrics publishing endpoint
            this.logger.info(`Dimensions: ${metric}=${values.join(',')}`);
        }

        // Reset the stored metrics
        this.counters = {};
        this.traces = {};
        this.dimensions = {};
    }

    dimension(key, value) {

        this.logger.debug(`received a dimension request: ${key}=${value}`);

        this.dimensions[key] = this.dimensions[key] || [];
        this.dimensions[key].push(value);

    }

    count(name) {

        this.logger.debug(`received a count request: ${name}`);

        this.counters[name] = this.counters[name] || 0;
        ++this.counters[name];
    }

    trace(name) {

        this.logger.debug(`received a trace request: ${name}`);

        const start = new Date();

        return {
            stop: () => {
                const elapsed = new Date();

                this.traces[name] = this.traces[name] || [];
                this.traces[name].push(elapsed - start);
            }
        }
    }
}

export default Metrics;
