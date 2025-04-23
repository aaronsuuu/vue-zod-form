import { describe, it, expect } from 'vitest'
import { useZodForm } from '../src/form'
import { z, ZodError } from 'zod'

describe('validateForm', () => {
  const { form, validate, clearOne, clearAll } = useZodForm({
    name: {
      value: '',
      schema: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    },
    age: {
      value: '',
      schema: z.number().min(18, { message: 'You must be at least 18 years old' }),
    },
    email: {
      value: '',
      schema: z.string().email({ message: 'Invalid email address' }),
    },
  })

  form.name.value = 'Aaron'
  form.age.value = 20
  form.email.value = 'abc123@gmail.com'

  it('should validate the form successfully', () => {
    validate()
    expect(form.name.value).toBe('Aaron')
    expect(form.age.value).toBe(20)
    expect(form.email.value).toBe('abc123@gmail.com')
  })

  it('should validate the form with partial keys', () => {
    form.age.value = 17
    expect(() => validate('age')).toThrow(ZodError)
    expect(form.age.error.message).toBe('You must be at least 18 years old')
  })

  it('should clear all fields', () => {
    clearAll()
    expect(form.name.value).toBe('')
    expect(form.age.value).toBe('')
    expect(form.email.value).toBe('')
  })

  it('should clear a specific field', () => {
    form.name.value = 'Aaron'
    clearOne('name')
    expect(form.name.value).toBe('')
  })

  it('should throw an error for all fields', () => {
    form.name.value = 'A'
    form.age.value = 17
    form.email.value = 'invalidemail'
    expect(() => validate()).toThrow(ZodError)
    expect(form.name.error.message).toBe('Name must be at least 3 characters long')
    expect(form.age.error.message).toBe('You must be at least 18 years old')
    expect(form.email.error.message).toBe('Invalid email address')
  })
})
