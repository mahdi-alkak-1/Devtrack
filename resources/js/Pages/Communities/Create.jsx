import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({ name: '' })

  function submit(e) {
    e.preventDefault()
    post(route('communities.store'))
  }

  return (
    <AuthenticatedLayout>
      <Head title="Create Community" />

      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">Create Community</h1>
        <p className="mt-1 text-sm text-white/60">
          Spin up a new space and invite your team.
        </p>
      </div>

      <form onSubmit={submit} className="max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
        <div>
          <label className="block text-sm font-medium text-white/80">Name</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            placeholder="e.g. Frontend Guild"
          />
          {errors?.name && <p className="mt-1 text-sm text-rose-400">{errors.name}</p>}
        </div>

        <div className="pt-1">
          <Button type="submit" disabled={processing}>
            {processing ? 'Creating…' : 'Create Community'}
          </Button>
        </div>
      </form>
    </AuthenticatedLayout>
  )
}
