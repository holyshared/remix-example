const endpoint = import.meta.env.VITE_API_ENDPOINT

export const pending = async () => {
  const resposne = await fetch(`${endpoint}/posts/pending`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "same-origin"
  })
  return resposne.json()
}
