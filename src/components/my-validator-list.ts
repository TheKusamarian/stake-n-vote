import { LitElement, html, customElement, property } from 'lit-element';

interface Validator {
    name: string;
    address: string;
}

type ValidatorListOptions =
    | { type: 'initializing' }
    | { type: 'not-enough-to-stake', totalAmount: number; requiredToStake: number; chainDecimals: number}
    | { type: 'no-staking-yet'; totalAmount: number; amountToStake: number; chainDecimals: number }
    | { type: 'staking'; currentValidators: Validator[] };

@customElement('my-validator-list')
class MyValidatorList extends LitElement {
    @property({ type: Array })
    suggestedValidators: Validator[] = [];
    @property({ type: Object })
    validationOptions: ValidatorListOptions = { type: 'initializing' };

    private formatInDOTs(amount: number, decimals: number) {
        return Math.round(amount / Math.pow(10, decimals) * 10000) / 10000;
    }

    render() {
        switch (this.validationOptions.type) {
        case 'initializing':
            return html`<div class="list"><my-spinner></my-spinner></div>`;
        case 'not-enough-to-stake':
            return html`<div class="list">
                <p class="has-text-centered">You need to have at least <b>${this.formatInDOTs(this.validationOptions.requiredToStake, this.validationOptions.chainDecimals)}</b>&nbsp;DOT to stake.
                You currently have <b>${this.formatInDOTs(this.validationOptions.totalAmount, this.validationOptions.chainDecimals)}</b>&nbsp;DOT.</p>
            </div>`;
        case 'no-staking-yet':
            return html`<div class="list">
                <p class="has-text-centered">No staking is currently set up.
                    We will bond <b>${this.formatInDOTs(this.validationOptions.amountToStake, this.validationOptions.chainDecimals)}</b>&nbsp;DOT (out of ${this.formatInDOTs(this.validationOptions.totalAmount, this.validationOptions.chainDecimals)}&nbsp;DOT available) for staking and allocate it to the following validators:</p>
                    ${this.suggestedValidators.map((validator) => html`
                        <my-validator class="list-item has-background-success-light" name="${validator.name}" address="${validator.address}"></my-validator>
                    `)}
            </div>`;
        case 'staking':
            return html`<div class="list">
                ${this.suggestedValidators.map((validator) => html`
                    <my-validator class="list-item has-background-success-light" name="${validator.name}" address="${validator.address}"></my-validator>
                `)}
                ${this.validationOptions.currentValidators.map((validator) => html`
                    <my-validator class="list-item" name="${validator.name}" address="${validator.address}" existing="true"></my-validator>
                `)}
            </div>`;
        default:
            console.error('Unknown validator list type', this.validationOptions);
            return html``;
        }
    }

    // Opting out of ShadowDOM in favor of LightDOM to allow for Bulma CSS to work
    protected createRenderRoot() {
        return this;
    }
}