# 微信小程序请求封装

```javascript
import request from 'wxreq'

request
  .get('http://url.com', { data: { a: 1 } })
  .then(console.log)
  .catch(console.log)

const instance = request.create({ baseUrl: 'http://url.com' })
instance.request({ url: '/api' }).then(console.log)
```