import { Events } from './events';

/*
 * Uses bootstrap to display page notifications
 */
class AppNotifier {

    constructor(logger, metrics, eventBus) {

        this.logger = logger.withModule('app-notifier');
        this.metrics = metrics;
        this.eventBus = eventBus;
        this.$container = this.getDomElementFromHtmlString(
            '<div id="toast-container" class="toast-container position-absolute top-0 end-0 p-3"></div>'
        );

        document.body.appendChild(this.$container);

        this.attachEventHandlers();

    }

    attachEventHandlers() {
        this.eventBus.on(Events.Notify.App, (payload) => {

            this.logger.debug(`received an app notification request with payload: ${JSON.stringify(payload)}`);

            const { stop } = this.metrics.trace('notifier:app:show');
            this.show(payload);
            stop();
        });
    }

    getDomElementFromHtmlString(htmlString) {

        const divEl = document.createElement('div');
        divEl.innerHTML = htmlString.trim();

        return divEl.firstChild;
    }

    show(payload) {

        this.metrics.count('notifier:app:show');

        const { title, message } = payload;

        // generate a dom element with the data interpolated
        const parsed = this.parse({ title, message });
        const $toastEl = this.getDomElementFromHtmlString(parsed);

        // append it to the dom in preparation for rendering
        this.$container.appendChild($toastEl);

        // remove the dom element once it is hidden
        $toastEl.addEventListener('hidden.bs.toast', () => {
            // can't use 'this' inside arrow function
            $toastEl.remove();
        })

        // render the toast
        const toast = new bootstrap.Toast($toastEl);
        toast.show();
    }

    parse(data) {

        const { title, message } = data;

        if (!message) {
            this.logger.warn(`payload provided for toast is missing a message: ${JSON.stringify(data)}`);
            return;
        }

        return `
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">${title || 'App Notification'}</strong>
                        <small class="text-muted">Just now</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
        `;
    }

    test() {
        this.eventBus.emit(Events.Notify.App, { title: 'MicroFrontend', message: 'The page notifier says hello!' });
        this.eventBus.emit(Events.Notify.App, { title: 'MicroFrontend', message: 'Another notification!' });
        setTimeout(() => { this.eventBus.emit(Events.Notify.App, { message: 'A delayed notification with default title' }) }, 3000);
    }

}

export default AppNotifier;
