import sketch from 'sketch'
import analytics from '@ozgurgunes/sketch-plugin-analytics'
import {
  errorMessage,
  successMessage,
  alert,
  textField
} from '@ozgurgunes/sketch-plugin-ui'

export function setBaselineOffset() {
  try {
    let selection = getSelection()
    let message =
      '- Positive (+) values to raise. \n' + 
      '- Negative (-) values to lower. \n' +
      "- 0 (zero) to reset."
    let buttons = ['Set', 'Cancel']
    let accessory = textField(0)
    let response = alert(message, buttons, accessory).runModal()
    let value = accessory.stringValue()
    if (response === 1000) {
      if (!Number(value) && value != 0) {
        return alert('Please enter a number.').runModal()
      }
      console.log(value)
      selection.forEach(layer => {
        layer.sketchObject.addAttribute_value_forRange(
          NSBaselineOffsetAttributeName,
          Number(value) || null,
          NSMakeRange(0, layer.text.length)
        )
      })
      analytics(null, selection.length)
      if (value == 0) {
        successMessage(
          `${selection.length} text layer${getPlural(
            selection
          )} baseline reset to default.`
        )
      } else {
        successMessage(
          `${selection.length} text layer${getPlural(
            selection
          )} baseline offset set to ${value}.`
        )
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export function raiseBaseline() {
  try {
    let selection = getSelection()
    selection.forEach(layer => {
      layer.sketchObject.addAttribute_value_forRange(
        NSBaselineOffsetAttributeName,
        (layer.sketchObject.styleAttributes().NSBaselineOffset || 0) + 1,
        NSMakeRange(0, layer.text.length)
      )
    })
    analytics(null, selection.length)
    successMessage(
      `${selection.length} text layer${getPlural(selection)} baseline raised.`
    )
  } catch (e) {
    console.log(e)
  }
}

export function lowerBaseline() {
  try {
    let selection = getSelection()
    selection.forEach(layer => {
      layer.sketchObject.addAttribute_value_forRange(
        NSBaselineOffsetAttributeName,
        (layer.sketchObject.styleAttributes().NSBaselineOffset || 0) - 1,
        NSMakeRange(0, layer.text.length)
      )
    })
    analytics(null, selection.length)
    successMessage(
      `${selection.length} text layer${getPlural(selection)} baseline lowered.`
    )
  } catch (e) {
    console.log(e)
  }
}

export function useDefaultBaseline() {
  try {
    let selection = getSelection()
    selection.forEach(layer => {
      layer.sketchObject.addAttribute_value_forRange(
        NSBaselineOffsetAttributeName,
        null,
        NSMakeRange(0, layer.text.length)
      )
    })
    analytics(null, selection.length)
    successMessage(
      `${selection.length} text layer${getPlural(
        selection
      )} baseline reset to default.`
    )
  } catch (e) {
    console.log(e)
  }
}

function getPlural(selection) {
  return selection.length == 1 ? "'s" : "s'"
}

function getSelection() {
  let selection = sketch
    .getSelectedDocument()
    .selectedLayers.layers.filter(layer => layer.type == sketch.Types.Text)
  if (selection.length < 1) {
    analytics('Selection Error')
    errorMessage('Please select text layers.')
    throw 'No selection!'
  }
  return selection
}
