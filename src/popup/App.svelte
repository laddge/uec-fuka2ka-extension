<script lang='ts'>
  let from: number, to: number
  const submit = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, JSON.stringify({ from, to }))
      }
    })
  }
</script>

<div class="p-6">
  <p class="text-lg font-bold mb-4 opacity-75">成績改変</p>
  <div class="flex items-center mb-4">
    <select bind:value={from} class="select w-30">
      <option value={4}>秀</option>
      <option value={3}>優</option>
      <option value={2}>良</option>
      <option value={1}>可</option>
      <option value={0} selected>不可</option>
    </select>
    <div class="px-4">→</div>
    <select bind:value={to} class="select w-30">
      <option value={4}>秀</option>
      <option value={3}>優</option>
      <option value={2}>良</option>
      <option value={1} selected>可</option>
      <option value={0}>不可</option>
    </select>
  </div>
  <div class="text-right">
    <button on:click={submit} class="btn btn-soft">適用</button>
  </div>
</div>
