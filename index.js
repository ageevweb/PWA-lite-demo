window.addEventListener('load', async () => {
  // проверка на поддержку
  if ('serviceWorker' in navigator){
    try {
      const reg =  await navigator.serviceWorker.register('/serviceWorker.js')
      console.log(reg)
    } catch(e) {
      console.warn('serviceWorker fail')
    }
  }
  await loadPosts()
})


async function loadPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=11')
  const data = await res.json()

  const container = document.querySelector('#posts')
  container.innerHTML = data.map(toCard).join('\n')
}

function toCard(post) {
  return `
    <div class="card">
      <div class="card-title">
        ${post.title}
      </div>
      <div class="card-body">
        ${post.body}
      </div>
    </div>
  `
}