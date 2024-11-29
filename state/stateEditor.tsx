import { Form, FormField } from "@/schema"
import { persistentAtom } from "@nanostores/persistent"
import { useStore } from "@nanostores/react"
import { atom } from "nanostores"
import { mockFields } from "@/components/formbuilder/mockFields"
import { use, useEffect, useState, useRef } from 'react'
import api from '@/Modules/Auth'

export type State = {
  selectedForm: number
  forms: Form[]
}

type FieldType = {
  type: any
  id: any
  label: any
  key: any
  required: any
  validation: any
  value: any
}

type FormType = {
  name: string
  fields: FieldType[]
}

export const $appState = persistentAtom<State>(
  "state",
  { selectedForm: 0, forms: [{ name: 'myform', fields: mockFields }] },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
)

export function useAppStateEditor(id: string) {
  const state = useStore($appState)
  const prevIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (prevIdRef.current !== id) {
      fetchforms(id, state)
      prevIdRef.current = id
    }
  }, [id, state])

  return {
    selectedForm: 0,
    forms: state.forms,
    selectForm,
    deleteForm,
    updateFormName,
    updateFormFields,
    newForm,
    setAppState,
    resetForms,
    fetchforms,
  }
}

function resetForms() {
  setAppState({ selectedForm: 0, forms: [{ name: "My Form", fields: [] }] })
}

function setAppState(state: State) {
  $appState.set(state)
}

function newForm(f: Form) {
  let currentForms = $appState.get().forms
  $appState.set({
    ...$appState.get(),
    forms: currentForms.concat(f),
  })
}

async function fetchforms(id: string, state: State) {
  try {
    const response = await api.get(`/api/forms/${id}`)
    console.log('Resposta:', response)
    const newState = {
      ...state,
      forms: [{
        name: response.data.name,
        fields: Object.entries(response.data.form).slice(0, -1).map(([key, field]: [string, any]) => field)
      }]
    }
    console.log('Novo estado:', newState)
    $appState.set(newState)
  } catch (error) {
    console.error('Erro:', error)
  }
}

function updateFormFields(p: FormField[]) {
  let newForms = $appState.get().forms
  let selectedForm = $appState.get().selectedForm
  if (selectedForm < newForms.length) {
    newForms[selectedForm].fields = p
    $appState.set({
      ...$appState.get(),
      forms: newForms,
    })
  } else {
    console.error('Erro: selectedForm é um índice inválido em newForms')
  }
}

function selectForm(selectedForm: number) {
  $appState.set({ ...$appState.get(), selectedForm })
}

function deleteForm(idx: number) {
  if ($appState.get().forms.length === 1) return $appState.get()
  $appState.set({
    forms: $appState.get().forms.filter((_f, i) => i !== idx),
    selectedForm: 0,
  })
}

function updateFormName(newName: string) {
  let currentForms = $appState.get().forms
  currentForms[$appState.get().selectedForm].name = newName
  $appState.set({
    ...$appState.get(),
    forms: currentForms,
  })
}