const helpers = {
  setToken: (token: string) => {
    localStorage.setItem('token', token)
  },

  getToken: () => {
    return localStorage.getItem('token')
  },
  deleteToken: () => {
    localStorage.removeItem('token')
  },
  stringifyArgs: (args: any) => {
    if (args) {
      const array = []
      for (const [key, value] of Object.entries(args)) {
        array.push(`${key}: ${typeof value === 'string' ? '"' + value + '"' : value}`)
      }
      return `(${array.join(', ')})`
    } else return ''
  },
  auth: () => new Headers({ Authorization: `Bearer ${helpers.getToken()}` }),
  fetcher: (
    url: string,
    method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
    body?: object | null | undefined
  ) => {
    const token = helpers.getToken()
    return fetch(url, {
      method,
      redirect: 'follow',
      mode: 'cors',
      headers: token
        ? {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        : {
            'Content-Type': 'application/json',
          },
      body: body && JSON.stringify(body),
    }).then((response) => response.json())
  },
}

export default helpers
