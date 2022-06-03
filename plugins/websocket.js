import Vue from 'vue'
import Echo from 'laravel-echo'

window.io = require('socket.io-client')

export const echo_instance = new Echo({
  broadcaster: 'socket.io',
  host: process.env.VUE_APP_BACKEND_APP + ':6001',
  auth: {
    headers: {
      /** I'm using access tokens to access  **/
      Authorization:
        'Bearer ' +
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc3OTYyYTQ2YjY4MDgyMmQ1NDJmMTUwNzE1ZDhiODkwOTU3ZjQ2OGEyMGE3ZWI1ZTIyY2Y2YzVhNDhkYjFmNDJiMDAwOTM1NDg3MzNhMGNlIn0.eyJhdWQiOiIxIiwianRpIjoiNzc5NjJhNDZiNjgwODIyZDU0MmYxNTA3MTVkOGI4OTA5NTdmNDY4YTIwYTdlYjVlMjJjZjZjNWE0OGRiMWY0MmIwMDA5MzU0ODczM2EwY2UiLCJpYXQiOjE2MjUxMjY1NTQsIm5iZiI6MTYyNTEyNjU1NCwiZXhwIjoxNjU2NjYyNTU0LCJzdWIiOiIyNTMxOSIsInNjb3BlcyI6W119.OcP44stA_0xea91wkvM0lzTRCewMJh_W7X9H6ARrKm3CxCDdBBxzsrHGnB637-El50BM9fUE7CVLmoOOxk22d_yYrerUfXbKL7ukOUN_3219kWJrWeBHKK-ycle8CTGG5w7i7IOqJr5kk9HTSVlKcL_pQEcfMk9btvX4EnzLH5anxBo83WZSIITkNP9s9GGuWDkAzldvs5i5dCVc8kcYzCfozYZH7Ys62b6G8xRAkmjViYkSWhdta7dAxtOOunX7-PMDUnnhZMSxjYvFTdDFLaxxTS0CUQMrTulOaJQE80e9_P7opTLQNAsD3m71XUH8FUFq_Go1K5U5ZYaQxO-L-qnR-8JRZkZEBvp3L_wUUwt8WsdoYtZbqAUFocHpx6tU4g0hZyMJ_F5uxj8w2RF3EdK9L2l6-OoRKf_qamQMlCcwQkgphdy5ecOEsekWkIJ9lqPplOILVWzd9iqCWz6KkesU5gOcQvU2ENi3aK510suoF-hv43qiyjWRA7nJONy9YfZp9ELpdbtSE0_y7n3rIUG97LdQ2fgnmXaC648neOqEbQKqXgspRMsurcWQyLXn_l9Z5Ydrsr8ae_VUwHZ7K1fMAJyBd5XEwcuJfuLcjCLGxgwqIl6K08SEWlRjnN78UQO9-SDIbtMhu4NanyfxnEbzewHOv7kqDjp_dZkBFDI'
    }
  }
})

Vue.prototype.$echo = echo_instance
