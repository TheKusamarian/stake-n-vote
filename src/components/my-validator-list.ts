import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators';

@customElement('my-validator-list')
class MyValidatorList extends LitElement {
    @property({type: Array})
    suggestedValidators = [];
    @property({type: Array})
    currentValidators = [];

    // Opting out of ShadowDOM in favor of LightDOM to allow for Bulma CSS to work
    createRenderRoot() {
        return this;
    }

    render() {
        return html`<div class="list">
            ${this.suggestedValidators.map((validator) => html`
                <my-validator class="list-item has-background-success-light" name="${validator.name}" address="${validator.address}"></my-validator>
            `)}
            ${this.currentValidators.map((validator) => html`
                <my-validator class="list-item" name="${validator.name}" address="${validator.address}" existing="true"></my-validator>
            `)}
        </div>`;
    }
}