<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
</script>

<div class="settings flex flex-col gap-4">
	<label class="label">
		<span class="label-text">{m.settings_name_label()}</span>
		<input class="input" type="text" placeholder={m.settings_name_placeholder()} />
	</label>
</div>
