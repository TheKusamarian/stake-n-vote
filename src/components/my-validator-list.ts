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
    @property({type: Boolean})
    noStakingYet = false;
    @property({type: Object})
    validationOptions = { totalAmount: 0, amountToStake: 0, chainDecimals: 0};

    private totalAmountInDOTs() {
        // Rounding to 4 decimal places
        return Math.round(this.validationOptions.totalAmount / Math.pow(10, this.validationOptions.chainDecimals) * 10000) / 10000;
    }

    private amountToStakeInDOTs() {
        // Rounding to 4 decimal places
        return Math.round(this.validationOptions.amountToStake / Math.pow(10, this.validationOptions.chainDecimals) * 10000) / 10000;
    }

    render() {
        if (this.noStakingYet) {
            return html`<div class="list"><p class="has-text-centered">No staking is currently set up. We will bond <b>${this.amountToStakeInDOTs()}</b>&nbsp;DOT (out of ${this.totalAmountInDOTs()}&nbsp;DOT available) for staking and allocate it to the following validators:</p>
                ${this.suggestedValidators.map((validator) => html`
                    <my-validator class="list-item has-background-success-light" name="${validator.name}" address="${validator.address}"></my-validator>
                `)}
            </div>`;
        }

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