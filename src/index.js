import AppNotifier from './app-notifier';
import EventBus from './event-bus';
import Logger from './logger';
import Metrics from './metrics';
import SystemNotifier from './system-notifier';

function init() {

    const logger = new Logger();
    const metrics = new Metrics(logger);
    const eventBus = new EventBus(logger);
    const appNotifier = new AppNotifier(logger, metrics, eventBus);
    const systemNotifier = new SystemNotifier(logger, metrics, eventBus);

    // get a reference to an existing object or create a new one for our app namespace (mf = micro-frontend)
    window.mf = window.mf || {};

    const mf = window.mf;
    mf.logger = logger;
    mf.notifier = mf.notifier || {};
    mf.notifier.app = appNotifier;
    mf.notifier.system = systemNotifier;

    // test
    appNotifier.test();
    // systemNotifier.test();

}

window.onload = init;
