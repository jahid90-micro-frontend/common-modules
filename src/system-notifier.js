import { Events } from './events';

/*
 * Uses Browser Notifications API to display system notifications
 */
// Notification is not supported in insecure(http) sites, even though the window.Notification object exists
class SystemNotifier {

    constructor(logger, metrics, eventBus) {

        this.logger = logger.withModule('system--notifier');
        this.metrics = metrics;
        this.eventBus = eventBus;

        this.enabled = false;

        this.checkIfPermitted();

        // attach event handler
        this.eventBus.on(Events.Notify.System, (payload) => {

            this.logger.debug(`received a system notification request with payload ${JSON.stringify(payload)}`);

            const { stop } = this.metrics.trace('notifier:system:show');
            this.show(payload);
            stop();
        });
    }

    checkIfPermitted() {

        if (!window.Notification) {

            this.logger.warn('system notifications are not supported in this browser');
            return;
        }

        // If permission granted from a previous session
        if (Notification.permission === 'granted') {

            this.enabled = true;
            this.logger.info('permission is granted from a previous session to show system notifications');

        }
        // If permission denied from a previous session
        else if (Notification.permission === 'denied') {

            this.logger.warn('permission is denied from a previous session for system notifications')

        }
        // If permission not yet requested
        else {

            this.logger.debug('requesting permission to show system notifications');

            Notification.requestPermission().then((permission) => {

                this.logger.debug(Notification.permission);
                if (Notification.permission == 'granted') {
                    this.enabled = true;
                    this.logger.info('permission has been granted');
                } else {
                    this.logger.warn('permission has been denied - no system notifications will be displayed')
                }
            });
        }
    }

    show(payload) {

        this.metrics.count('notifier:system:show');

        this.logger.debug(`notification requested with payload: ${JSON.stringify(payload)}`);
        this.enabled && new window.Notification(payload.message);
    }

    test() {
        this.eventBus.emit(Events.Notify.System, { message: 'Welcome to MicroFrontend!!' });
    }

}

export default SystemNotifier;
