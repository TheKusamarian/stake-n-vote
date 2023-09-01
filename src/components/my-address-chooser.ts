import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators';

@customElement('my-address-chooser')
class MyAddressChooser extends LitElement {
    @property({ type: Array })
    accounts = [];
    @property({ type: Number })
    selectedAccount = 0;
    @property({ type: Boolean })
    initialized = false;

    @property({ type: Function})
    onAccountChange = () => {};

    // Create properties for the event handlers.
    private dropdownClickHandler;
    private documentClickHandler;
    

    render() {
        if (!this.initialized) {
            return html`<div class="dropdown ">
                <div class="dropdown-trigger">
                    <button class="button" disabled>
                        <span>Loading...</span>
                    </button>
                </div>
            </div>`;
        };

        // Show "not found" if `this.accounts` is empty
        if (this.accounts.length === 0) {
            return html`<div class="dropdown ">
                <div class="dropdown-trigger">
                    <button class="button" disabled>
                        <span>No accounts found</span>
                    </button>
                </div>
            </div>`;
        };

        return html`
            <div class="dropdown ">
                <div class="dropdown-trigger">
                    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>${this.accounts[this.selectedAccount].meta.name}</span>
                        <span class="icon is-small">
                            🔻
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                        ${this.accounts.map((account, index) => html`
                            <a href="#" class="dropdown-item" @click="${() => {this.selectedAccount = index; this.onAccountChange(this.accounts[this.selectedAccount])}}">${account.meta.name}</a>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }

    // Some JS to make the dropdown work. (Note: we're not using ShadowDOM here, so shadowRoot is not accessible)
    updated() {
        const dropdown = this.querySelector('.dropdown');
        const dropdownTrigger = this.querySelector('.dropdown-trigger');

        this.dropdownClickHandler = (event: Event): void => {
            event.stopPropagation();
            dropdown.classList.add('is-active');
        };
        dropdownTrigger.addEventListener('click', this.dropdownClickHandler);

        this.documentClickHandler = () => {
            dropdown.classList.remove('is-active');
        };
        document.addEventListener('click', this.documentClickHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        const dropdownTrigger = this.querySelector('.dropdown-trigger');

        dropdownTrigger.removeEventListener('click', this.dropdownClickHandler);
        document.removeEventListener('click', this.documentClickHandler);
    }

    // Opting out of ShadowDOM in favor of LightDOM to allow for Bulma CSS to work
    protected createRenderRoot() {
        return this;
    }
}