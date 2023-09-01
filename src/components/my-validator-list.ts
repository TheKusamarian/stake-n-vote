import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators';

@customElement('my-validator-list')
class MyValidatorList extends LitElement {
    @property({type: Array})
    suggestedValidators = [];
    @property({type: Array})
    currentValidators = [];
    @property({type: Boolean})
    initialized = false;

    render() {
        return this.initialized
        ? html`<div class="list">
            ${this.suggestedValidators.map((validator) => html`
                <my-validator class="list-item has-background-success-light" name="${validator.name}" address="${validator.address}"></my-validator>
            `)}
            ${this.currentValidators.map((validator) => html`
                <my-validator class="list-item" name="${validator.name}" address="${validator.address}" existing="true"></my-validator>
            `)}
        </div>`
        : html`<div class="list"><my-spinner></my-spinner></div>`;
    }

    // Opting out of ShadowDOM in favor of LightDOM to allow for Bulma CSS to work
    protected createRenderRoot() {
        return this;
    }
}