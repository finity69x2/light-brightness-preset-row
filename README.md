# light-brighness-preset-row
Provides a means to program 3 preset brightness settings for dimmable lights

Installation:

Copy the light-brightness-preset-row.js file to the appropriate folder in your Home Assistant Configuration directory (/config/www/).

Place the following in your "resources" section in your lovelace configuration (updating the localation to where you placed the above file):

  ```
    - url: /local/light-brightness-preset-row.js
      type: js
  ```
    
Then to use this in a card place the following in your entity card:


<b>Options:</b>

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| entity | String | Yes | none | a dimmable light entity_id |
| type | String | Yes | none | custom:light-brightness-entity-row |
| name | String | No | none | A custom name for the entity in the row |
| customTheme | Boolean | No | false | set to true to use a custom theme |
| customSetpoints | Boolean | No | false | set to true to use custom brightness setpoints |
| IsOffColor | String | No | '#f44c09' | Sets the color of the 'Off' button if light is off |
| IsOnLowColor | String | No | '#43A047' | Sets the color of the 'Low' button if light is on low |
| IsOnMedColor | String | No | '#43A047' | Sets the color of the 'Med' button if light is on Medium |
| IsOnHiColor | String | No | '#43A047' | Sets the color of the 'Hi' button if light is on high |
| ButtonInactiveColor | String | No | '#759aaa' | Sets the color of the the buttons if that selection is not "active" |
| LowBrightness | integer | No | 43 | Sets the brighness level for the "Low" button (valid range: 0 - 85) |
| MedBrightness | integer | No | 128 | Sets the brighness level for the "Med" button (valid range: 86 - 170) |
| HiBrightness | integer | No | 213 | Sets the brighness level for the "High" button (valid range: 171 - 255)|


The values for the colors can be any valid color string in "HEX", "RGB" or by color name.

If the light brightness is changed via any other means (slider, service call, etc) the buttons will indicate which range the light brightness is in based on the "valid Range" settings noted above.

<b>Comfguration Examples:</b>
    
  ```
    cards:
      - type: entities
        title: Hall Light Presets
        show_header_toggle: false
        entities:
        ## USE THIS CONFIG TO HAVE IT MATCH YOUR THEME ##
          - entity: light.hall_light
            type: custom:light-brightness-preset-row
            name: Light Not Custom Theme
            customTheme: false
        ## USE THIS CONFIG TO USE A DEFAULT CUSTOM THEME
          - entity: light.hall_light
            type: custom:light-brightness-preset-row
            name: Light Default Custom Theme
            customTheme: true
            customSetpoints: true
            LowBrightness: 30
            MedBrightness: 100
            HiBrightness: 225
        ## USE THIS CONFIG TO USE A 'CUSTOMZED' CUSTOM THEME
          - entity: light.hall_light
            type: custom:light-brightness-preset-row
            name: Light Custom Custom Theme
            customTheme: true
            IsOnLowColor: 'rgb(255, 0, 0)'
            IsOnMedColor: '#888888'
            IsOnHiColor: '#222222'
            ButtonInactiveColor: '#aaaaaa'
            IsOffColor: 'purple'
            
  ```

This is with the default Lovelace frontend theme set:

![Default](default_fan_ex.gif)


This is with the "Slate" frontend theme set:

![Slate](slate_fan_ex.gif)
