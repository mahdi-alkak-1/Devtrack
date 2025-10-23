@props(['url'])

<tr>
  <td class="header" align="center" style="padding:24px 0;">
    <a href="{{ $url ?? config('app.url') }}" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;">
      {{-- <img src="{{ asset('images/devtrack.png') }}" alt="{{ config('app.name') }}" width="36" height="36" style="display:block;border-radius:8px;"> --}}
      <span style="font-weight:700;font-size:18px;color:#e6f9ff;">
        {{ trim($slot) === '' ? config('app.name') : $slot }}
      </span>
    </a>
  </td>
</tr>
