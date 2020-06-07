Changes:

- v1.5 - added the ability to customize the text for the buttons. defaults to "OFF, LOW, MED, HIGH"

Provides a means to program 3 preset brightness settings for dimmable lights selectable from a Lovelace button row. THis plugin will also accept a "light group" as the entity_id.

This pluig-in was inspired by user @jazzyisj on the Home Assistant forum (community.home-assistant.io) as a thematically complementary plug-in for my fan control row.

This element is completely theme-able to provide a match to the "fan-control-entity-row" to provide a consistent look for the different elements in your Lovelace frontend

<b>Configuration Examples:</b>
    
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

![Default](ex2.gif)


This is with the "Slate" frontend theme set:

![Slate](ex3.gif)

This is how this plugin looks with the Fan control & Binary Button Rows:

![Slate-Compare](button-row-example-compare.gif)
