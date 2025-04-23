import type { Reactive } from 'vue'
import { ZodError, type ZodIssue, type ZodTypeAny, z } from 'zod'
import { reactive } from 'vue'
import type { Form, ZodErrorMessage, ZodForm, ZodFormItem, ZodFormOptions } from './type'

export function useZodForm(form: Form, options: ZodFormOptions = { safe: false }) {
  const reactiveForm: Reactive<ZodForm> = reactive(
    Object.entries(form).reduce((acc: Record<string, ZodFormItem>, [key, value]) => {
      acc[key] = {
        value: value.value || '',
        error: {
          message: '',
          extra: {} as ZodErrorMessage,
        },
        schema: value.schema,
      }
      return acc
    }, {}),
  )
  const schemaObj: Record<string, ZodTypeAny> = {}

  init()

  function init() {
    for (const key in reactiveForm) {
      if (reactiveForm[key].schema) schemaObj[key] = reactiveForm[key].schema
    }
  }

  function validate(...keys: string[]) {
    try {
      const schema = z.object(schemaObj)
      const values = _getValues()

      if (keys.length <= 0) {
        schema.parse(values)
        for (const key in reactiveForm) {
          reactiveForm[key].error.message = ''
          reactiveForm[key].error.extra = {}
        }
      } else {
        if (keys.some((key) => !schemaObj[key])) throw new Error('Invalid key')
        const partialSchema = schema.partial()
        const partialValues = Object.fromEntries(Object.entries(values).filter(([key]) => keys.includes(key)))
        partialSchema.parse(partialValues)
        keys.forEach((key) => {
          reactiveForm[key].error.message = ''
          reactiveForm[key].error.extra = {}
        })
      }

      if (options.safe) return { success: true }
    } catch (exception: unknown) {
      if (exception instanceof ZodError) {
        handleZodException(exception, reactiveForm)
        if (options.safe) return { success: false, message: 'Validation failed' }
        else throw exception
      }
      if (exception instanceof Error) {
        if (options.safe) return { success: false, message: exception.message }
        else throw exception
      }
    }
  }

  function clearAll() {
    for (const key in reactiveForm) clearOne(key)
  }

  function clearOne(key: string) {
    if (reactiveForm[key]) {
      reactiveForm[key].value = ''
      reactiveForm[key].error.message = ''
      reactiveForm[key].error.extra = {}
    }
  }

  function _getValues() {
    const initValues: Record<string, any> = {}
    return Object.entries(reactiveForm).reduce((acc, [key, value]) => {
      acc[key] = value.value
      return acc
    }, initValues)
  }

  return {
    form: reactiveForm,
    validate,
    clearOne,
    clearAll,
  }
}

export function handleZodException(exception: unknown, form: ZodForm) {
  if (!(exception instanceof ZodError)) return
  for (const error of exception.errors) {
    if (error.path.length > 0) {
      const _errorMessage = form[error.path[0]].error
      _errorMessage.message = error.message
      decorateExtra(_errorMessage, error)
    }
  }
}

export function decorateExtra(message: ZodErrorMessage, error: ZodIssue) {
  switch (error.code) {
    case 'too_small':
      message.extra = { min: error.minimum }
      break
    case 'too_big':
      message.extra = { max: error.maximum }
      break
    default:
      message.extra = {}
  }
}
