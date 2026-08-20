import { FormEvent, useEffect, useMemo, useState } from 'react'

type Category = 'Hortifruti' | 'Carnes' | 'Frios' | 'Mercearia' | 'Massas e grãos' | 'Padaria' | 'Congelados' | 'Bebidas' | 'Doces' | 'Higiene' | 'Limpeza' | 'Pet' | 'Farmácia' | 'Outros'
type ShoppingItem = { id: string; name: string; quantity: string; category: Category | ''; bought: boolean }

const storageKey = 'nossa-lista-items'
const categories: Category[] = ['Hortifruti', 'Carnes', 'Frios', 'Mercearia', 'Massas e grãos', 'Padaria', 'Congelados', 'Bebidas', 'Doces', 'Higiene', 'Limpeza', 'Pet', 'Farmácia', 'Outros']

function loadItems(): ShoppingItem[] {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function ItemRow({ item, onToggle, onDelete }: { item: ShoppingItem; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white p-3 shadow-sm">
      <input aria-label={`Marcar ${item.name} como ${item.bought ? 'pendente' : 'comprado'}`} checked={item.bought} className="h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-sky-500 focus:ring-sky-500" onChange={() => onToggle(item.id)} type="checkbox" />
      <div className="min-w-0 flex-1">
        <p className={`break-words font-medium ${item.bought ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.name}</p>
        {(item.quantity || item.category) && <p className="mt-0.5 text-sm text-slate-500">{[item.quantity, item.category].filter(Boolean).join(' · ')}</p>}
      </div>
      <button aria-label={`Excluir ${item.name}`} className="rounded-xl px-2.5 py-2 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600" onClick={() => onDelete(item.id)} type="button">Excluir</button>
    </li>
  )
}

export default function App() {
  const [items, setItems] = useState<ShoppingItem[]>(loadItems)
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [category, setCategory] = useState<Category | ''>('')

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)) }, [items])
  const pending = useMemo(() => items.filter((item) => !item.bought), [items])
  const bought = useMemo(() => items.filter((item) => item.bought), [items])

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    setItems((current) => [...current, { id: crypto.randomUUID(), name: trimmedName, quantity: quantity.trim(), category, bought: false }])
    setName(''); setQuantity(''); setCategory('')
  }

  function toggleItem(id: string) { setItems((current) => current.map((item) => item.id === id ? { ...item, bought: !item.bought } : item)) }
  function deleteItem(id: string) { setItems((current) => current.filter((item) => item.id !== id)) }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Vida a dois</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Nossa Lista</h1>
        <p className="mt-2 text-slate-600">Compras simples, organizadas juntos.</p>
      </header>

      <section aria-labelledby="add-title" className="rounded-3xl bg-white p-5 shadow-lg shadow-sky-100/70 sm:p-6">
        <h2 id="add-title" className="text-lg font-bold text-slate-900">Adicionar item</h2>
        <form className="mt-4 space-y-3" onSubmit={addItem}>
          <label className="block"><span className="sr-only">Item</span><input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder:text-slate-400" placeholder="Ex.: Arroz" autoFocus /></label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label><span className="sr-only">Quantidade (opcional)</span><input value={quantity} onChange={(event) => setQuantity(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder:text-slate-400" placeholder="Quantidade (opcional)" /></label>
            <label><span className="sr-only">Categoria (opcional)</span><select value={category} onChange={(event) => setCategory(event.target.value as Category | '')} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700"><option value="">Categoria (opcional)</option>{categories.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          </div>
          <button className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-400 active:scale-[0.99]" type="submit">Adicionar à lista</button>
        </form>
      </section>

      <section className="mt-8" aria-labelledby="pending-title">
        <div className="mb-3 flex items-center justify-between"><h2 id="pending-title" className="text-lg font-bold text-slate-900">Pendentes</h2><span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-600">{pending.length}</span></div>
        {pending.length ? <ul className="space-y-3">{pending.map((item) => <ItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />)}</ul> : <p className="rounded-2xl border border-dashed border-sky-200 bg-white/60 p-5 text-center text-slate-500">Sua lista está vazia. Adicione o primeiro item acima.</p>}
      </section>

      <section className="mt-8 pb-8" aria-labelledby="bought-title">
        <div className="mb-3 flex items-center justify-between"><h2 id="bought-title" className="text-lg font-bold text-slate-900">Comprados</h2><span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-600">{bought.length}</span></div>
        {bought.length ? <ul className="space-y-3">{bought.map((item) => <ItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />)}</ul> : <p className="text-center text-sm text-slate-500">Os itens marcados aparecerão aqui.</p>}
      </section>
    </main>
  )
}
