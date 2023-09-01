import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';

@customElement('my-validator')
class MyValidator extends LitElement {
  @property({type: String})
  name = '';
  @property({type: String})
  address = '';
  @property({type: Boolean})
  existing = false;

  // This is a helper function which truncates the address to 10 characters at the beginning and end
  // This is to make the address more readable
  private truncateAddress(address: string) {
    return `${address.substring(0, 10)}…${address.substring(address.length - 10, address.length)}`;
  }

  render() {
    return html`<div class="list-item-image">
        <figure class="image is-48x48">
            <img class="is-rounded" src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
        </figure>
    </div>
    <div class="list-item-content">    
        <div class="list-item-title ${classMap({"has-text-grey": this.existing})}">${this.name}</div>
        <div class="list-item-description is-family-monospace">${this.truncateAddress(this.address)}</div>
    </div>`;
  }
  
  // Opting out of ShadowDOM in favor of LightDOM to allow for Bulma CSS to work
  protected createRenderRoot() {
    return this;
  }
}