window.customCards = window.customCards || [];
window.customCards.push({
  type: "light-brightness-preset-row",
  name: "light brightness preset row",
  description: "A plugin to display your light controls in a button row.",
  preview: false,
});

const LitElement = customElements.get("ha-panel-lovelace") ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace")) : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class CustomLightBrightnessRow extends LitElement {

	constructor() {
		super();
		this._config = {
			customTheme: false,
			customSetpoints: false,
			reverseButtons: false,
			width: '30px',
			height: '30px',
			lowBrightness: 43,
			medBrightness: 128,
			hiBrightness: 213,
			isOffColor: '#f44c09',
			isOnLowColor: '#43A047',
			isOnMedColor: '#43A047',
			isOnHiColor: '#43A047',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			customLowText: 'LOW',
			customMedText: 'MED',
			customHiText: 'HIGH',
		};
	}
	
	static get properties() {
		return {
			hass: Object,
			_config: Object,
			_stateObj: Object,
			_lowSP: Number,
			_medSP: Number,
			_highSP: Number,
			_width: String,
			_height: String,
			_leftColor: String,
			_midLeftColor: String,
			_midRightColor: String,
			_rightColor: String,
			_leftText: String,
			_midLeftText: String,
			_midRightText: String,
			_rightText: String,
			_leftName: String,
			_midLeftName: String,
			_midRightName: String,
			_rightName: String,
			_leftState: Boolean,
			_midLeftState: Boolean,
			_midRightState: Boolean,
			_rightState: Boolean,
		};
	}

	static get styles() {
		return css`
			:host {
				line-height: inherit;
			}
			.box {
				display: flex;
				flex-direction: row;
			}
			.brightness {
				margin-left: 2px;
				margin-right: 2px;
				background-color: transparent;
				border: 1px solid var(--divider-color, lightgrey); 
				border-radius: 4px;
				font-size: 10px !important;
				color: var(--primary-text-color);
				display: inline-flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				line-height: 1;
				padding: 1px 6px;
				cursor: pointer;
				opacity: 1;
				transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease;
			}
			.brightness[aria-pressed='true'] {
				font-weight: 600;
				border-color: var(--accent-color, var(--primary-color));
				box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
			}
		`;
	}
	
	render() {
		return html`
			<hui-generic-entity-row .hass="${this.hass}" .config="${this._config}">
				<div id='button-container' class='box'>
					<button
						class='brightness'
						style='${this._leftColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						aria-pressed="${this._leftState ? 'true' : 'false'}"
						name="${this._leftName}"
						@click=${this.setBrightness}>${this._leftText}</button>
					<button
						class='brightness'
						style='${this._midLeftColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						aria-pressed="${this._midLeftState ? 'true' : 'false'}"
						name="${this._midLeftName}"
						@click=${this.setBrightness}>${this._midLeftText}</button>
					<button
						class='brightness'
						style='${this._midRightColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						aria-pressed="${this._midRightState ? 'true' : 'false'}"
						name="${this._midRightName}"
						@click=${this.setBrightness}>${this._midRightText}</button>
					<button
						class='brightness'
						style='${this._rightColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						aria-pressed="${this._rightState ? 'true' : 'false'}"
						name="${this._rightName}"
						@click=${this.setBrightness}>${this._rightText}</button>
				</div>
			</hui-generic-entity-row>
		`;
	}
	
	firstUpdated() {
		super.firstUpdated();
		this.shadowRoot.getElementById('button-container').addEventListener('click', (ev) => ev.stopPropagation());
	}

	setConfig(config) {
		if (!config.entity) {
			throw new Error("You need to define an entity");
		}
		this._config = { ...this._config, ...config };
	}

	updated(changedProperties) {
		if (changedProperties.has("hass")) {
			this.hassChanged();
		}
	}
	
	hassChanged(hass) {

		const config = this._config;
		const stateObj = this.hass.states[config.entity];
		const custTheme = config.customTheme;
		const custSetpoint = config.customSetpoints;
		const revButtons = config.reverseButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const OnLowClr = config.isOnLowColor;
		const OnMedClr = config.isOnMedColor;
		const OnHiClr = config.isOnHiColor;
		const OffClr = config.isOffColor;
		const buttonOffClr = config.buttonInactiveColor;
		const LowSetpoint = config.lowBrightness;
		const MedSetpoint = config.medBrightness;
		const HiSetpoint = config.hiBrightness;
		const custOffTxt = config.customOffText;
		const custLowTxt = config.customLowText;
		const custMedTxt = config.customMedText;
		const custHiTxt = config.customHiText;
						
		
		let lowSetpoint;
		let medSetpoint;
		let hiSetpoint;
		let low = false;
		let med = false;
		let high = false;
		let offstate = false;
		const isOn = stateObj && stateObj.state === 'on';
		const brightness = this._getBrightness(stateObj);
		
		if (custSetpoint) {
			medSetpoint = parseInt(MedSetpoint);
			if (parseInt(LowSetpoint) < 1) {
				lowSetpoint = 1;
			} else {
				lowSetpoint =  parseInt(LowSetpoint);
			}
			if (parseInt(HiSetpoint) > 254) {	
				hiSetpoint = 254;
			} else {
				hiSetpoint = parseInt(HiSetpoint);
			}
			if (isOn && brightness !== null && brightness <= ((medSetpoint + lowSetpoint) / 2)) {
				low = true;
			} else if (isOn && brightness !== null && brightness <= ((hiSetpoint + medSetpoint) / 2)) {
				med = true;
			} else if (isOn) {
				high = true;
			} else {
				offstate = true;
			}
		} else {
			lowSetpoint =  parseInt(LowSetpoint);
			medSetpoint = parseInt(MedSetpoint);
			hiSetpoint = parseInt(HiSetpoint);
			if (isOn && brightness !== null && brightness <= 85) {
				low = true;
			} else if (isOn && brightness !== null && brightness <= 170) {
				med = true;
			} else if (isOn) {
				high = true;
			} else {
				offstate = true;
			}
		}
		
		let lowcolor;
		let medcolor;
		let hicolor;
		let offcolor;

				
		if (custTheme) {
			if (low) {
				lowcolor = 'background-color:' + OnLowClr;
			} else {
				lowcolor = 'background-color:' + buttonOffClr;
			}
			if (med) {
				medcolor = 'background-color:'  + OnMedClr;
			} else {
				medcolor = 'background-color:' + buttonOffClr;
			}
			if (high) {
				hicolor = 'background-color:'  + OnHiClr;
			} else {
				hicolor = 'background-color:' + buttonOffClr;
			}
			if (offstate) {
				offcolor = 'background-color:'  + OffClr;
			} else {
				offcolor = 'background-color:' + buttonOffClr;
			}
		} else {
			if (low) {
				lowcolor = 'background-color: var(--state-light-active-color, var(--accent-color, var(--primary-color))); color: var(--text-primary-color, white); border-color: var(--state-light-active-color, var(--accent-color, var(--primary-color)))';
			} else {
				lowcolor = 'background-color: transparent; color: var(--primary-text-color); border-color: var(--divider-color, #759aaa)';
			}
			if (med) {
				medcolor = 'background-color: var(--state-light-active-color, var(--accent-color, var(--primary-color))); color: var(--text-primary-color, white); border-color: var(--state-light-active-color, var(--accent-color, var(--primary-color)))';
			} else {
				medcolor = 'background-color: transparent; color: var(--primary-text-color); border-color: var(--divider-color, #759aaa)';
			}
			if (high) {
				hicolor = 'background-color: var(--state-light-active-color, var(--accent-color, var(--primary-color))); color: var(--text-primary-color, white); border-color: var(--state-light-active-color, var(--accent-color, var(--primary-color)))';
			} else {
				hicolor = 'background-color: transparent; color: var(--primary-text-color); border-color: var(--divider-color, #759aaa)';
			}
			if (offstate) {
				offcolor = 'background-color: var(--disabled-color, var(--secondary-text-color, #759aaa)); color: var(--text-primary-color, white); border-color: var(--disabled-color, var(--secondary-text-color, #759aaa))';
			} else {
				offcolor = 'background-color: transparent; color: var(--primary-text-color); border-color: var(--divider-color, #759aaa)';
			}
		}

		let offtext = custOffTxt;
		let lowtext = custLowTxt;
		let medtext = custMedTxt;
		let hitext = custHiTxt;
		
		let offname = 'off'
		let lowname = 'low'
		let medname = 'medium'
		let hiname = 'high'
		
		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;
		
		if (revButtons) {
			this._stateObj = stateObj;
			this._leftState = offstate;
			this._midLeftState = low;
			this._midRightState = med;
			this._rightState = high;
			this._width = buttonwidth;
			this._height = buttonheight;
			this._leftColor = offcolor;
			this._midLeftColor = lowcolor;
			this._midRightColor = medcolor;
			this._rightColor = hicolor;
			this._lowSP = lowSetpoint;
			this._medSP = medSetpoint;
			this._highSP = hiSetpoint;
			this._leftText = offtext;
			this._midLeftText = lowtext;
			this._midRightText = medtext;
			this._rightText = hitext;
			this._leftName = offname;
			this._midLeftName = lowname;
			this._midRightName = medname;
			this._rightName = hiname;
		} else {
			this._stateObj = stateObj;
			this._leftState = high;
			this._midLeftState = med;
			this._midRightState = low;
			this._rightState = offstate;
			this._width = buttonwidth;
			this._height = buttonheight;
			this._leftColor = hicolor;
			this._midLeftColor = medcolor;
			this._midRightColor = lowcolor;
			this._rightColor = offcolor;
			this._lowSP = lowSetpoint;
			this._medSP = medSetpoint;
			this._highSP = hiSetpoint;
			this._leftText = hitext;
			this._midLeftText = medtext;
			this._midRightText = lowtext;
			this._rightText = offtext;
			this._leftName = hiname;
			this._midLeftName = medname;
			this._midRightName = lowname;
			this._rightName = offname;
		}
	}

	_getBrightness(stateObj) {
		if (!stateObj || !stateObj.attributes) {
			return null;
		}

		const brightness = Number(stateObj.attributes.brightness);
		if (Number.isFinite(brightness)) {
			return Math.max(0, Math.min(255, brightness));
		}

		const entityIds = stateObj.attributes.entity_id;
		if (Array.isArray(entityIds) && entityIds.length > 0) {
			const memberBrightness = entityIds
				.map((entityId) => this.hass.states[entityId])
				.filter((memberState) => memberState && memberState.state === 'on' && memberState.attributes)
				.map((memberState) => Number(memberState.attributes.brightness))
				.filter((value) => Number.isFinite(value));

			if (memberBrightness.length > 0) {
				const averageBrightness = memberBrightness.reduce((sum, value) => sum + value, 0) / memberBrightness.length;
				return Math.max(0, Math.min(255, averageBrightness));
			}
		}

		return null;
	}

	setBrightness(e) {
		const level = e.currentTarget.getAttribute('name');
		const param = {entity_id: this._config.entity};
		if( level == 'off' ){
			this.hass.callService('light', 'turn_off', param);
		} else if (level == 'low') {
			param.brightness = this._lowSP;
			this.hass.callService('light', 'turn_on', param);
		} else if (level == 'medium') {
			param.brightness = this._medSP;
			this.hass.callService('light', 'turn_on', param);
		} else if (level == 'high') {
			param.brightness = this._highSP;
			this.hass.callService('light', 'turn_on', param);
		}
	}
}
	
customElements.define('light-brightness-preset-row', CustomLightBrightnessRow);
