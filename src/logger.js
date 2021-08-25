class Logger {

    // No-op by default
    logger = {
        log: () => { },
        debug: () => { },
        info: () => { },
        warn: () => { },
        error: () => { }
    };

    constructor() {

        this.module = 'main';

        // console may not be present in some browser
        window.console && (this.logger = window.console);
    }

    prefix() {
        return `(micro-frontend::${this.module})`
    }

    withModule(module) {
        const logger = new Logger();
        logger.module = module;

        return logger;
    }

    log(...args) {
        this.logger.log(`[LOG] ${this.prefix()} `, ...args);
    }

    debug(...args) {
        this.logger.debug(`[DEBUG] ${this.prefix()} `, ...args);
    }

    info(...args) {
        this.logger.info(`[INFO] ${this.prefix()} `, ...args);
    }

    warn(...args) {
        this.logger.warn(`[WARN] ${this.prefix()} `, ...args);
    }

    error(...args) {
        this.logger.error(`[ERROR] ${this.prefix()} `, ...args);
    }
}

export default Logger;
