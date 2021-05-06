import sketch from 'sketch'
import analytics from '@ozgurgunes/sketch-plugin-analytics'
import {
  showMessage,
  errorMessage,
  successMessage,
  alert,
  textField
} from '@ozgurgunes/sketch-plugin-ui'

export function setBaselineOffset() {
  let selection = getSelection()
  if (!selection) return
  let message =
    '- Positive (+) values to raise. \n' +
    '- Negative (-) values to lower. \n' +
    '- 0 (zero) to reset.'
  let buttons = ['Set', 'Cancel']
  let accessory = textField(0)
  let response = alert(message, buttons, accessory).runModal()
  let value = accessory.stringValue()
  if (response === 1001) return
  if (!Number(value) && value != 0) {
    return alert('Please enter a number.').runModal()
  }
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

export function raiseBaseline() {
  let selection = getSelection()
  if (!selection) return
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
}

export function lowerBaseline() {
  let selection = getSelection()
  if (!selection) return
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
}

export function useDefaultBaseline() {
  let selection = getSelection()
  if (!selection) return
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
}

export function showBaseline() {
  let selection = getSelection()
  if (!selection) return
  if (selection.length > 1) {
    analytics('Selection Error')
    return errorMessage('Please select 1 text layer only.')
  }
  analytics(null, selection.length)
  showMessage(selection[0].sketchObject.styleAttributes().NSBaselineOffset || 0)
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
    return errorMessage('Please select text layers.')
  }
  return selection
}
