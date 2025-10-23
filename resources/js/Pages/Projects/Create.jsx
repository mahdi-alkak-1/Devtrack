import Button from '@/Components/Button'
import { Head, useForm, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Create({ communities = [] }) {
  const { errors } = usePage().props
  const { data, setData, post, processing } = useForm({
    name: '',
    key: '',
    description: '',
    community_id: '',
  })

  function submit(e) {
    e.preventDefault()
    post('/projects')
  }

  return (
    <AuthenticatedLayout>
      <Head title="Create Project" />

      {/* Card */}
      <section className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow">
        <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-white">Create Project</h1>
          <p className="mt-1 text-xs text-white/60">Give it a short key (e.g. WEB) and (optionally) attach it to a community.</p>
        </div>

        <form onSubmit={submit} className="space-y-5 p-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/80">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none ring-0 focus:border-cyan-400/60"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              placeholder="Marketing Site"
            />
            {errors?.name && <p className="mt-1 text-sm text-rose-400">{errors.name}</p>}
          </div>

          {/* Key */}
          <div>
            <label className="block text-sm font-medium text-white/80">Key</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
              value={data.key}
              onChange={e => setData('key', e.target.value)}
              placeholder="WEB"
            />
            {errors?.key && <p className="mt-1 text-sm text-rose-400">{errors.key}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80">Description</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              placeholder="Short summary or goals…"
            />
            {errors?.description && <p className="mt-1 text-sm text-rose-400">{errors.description}</p>}
          </div>

          {/* Community */}
          <div>
            <label className="block text-sm font-medium text-white/80">Community (optional)</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
              value={data.community_id}
              onChange={e => setData('community_id', e.target.value)}
            >
              <option className="bg-[#0f1731]" value="">— No community —</option>
              {communities.map(c => (
                <option key={c.id} value={c.id} className="bg-[#0f1731]">
                  {c.name}
                </option>
              ))}
            </select>
            {errors?.community_id && <p className="mt-1 text-sm text-rose-400">{errors.community_id}</p>}
          </div>

          <div className="pt-1">
            <Button type="submit" disabled={processing} className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300">
              {processing ? 'Creating…' : 'Create Project'}
            </Button>
          </div>
        </form>
      </section>
    </AuthenticatedLayout>
  )
}
