import type { ZodTypeAny } from 'zod'

export type FormItem = {
  value: any
  schema: ZodTypeAny
}
export type Form = Record<string, FormItem>
export type ZodFormOptions = {
  safe: boolean
}
export type ZodErrorMessage = {
  message: string
  extra: Record<string, unknown>
}

export type ZodFormItem = {
  value: any
  error: ZodErrorMessage
  schema?: ZodTypeAny
}

export type ZodForm = Record<string, ZodFormItem>
