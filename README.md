# modularity
modularity - lite module control

``` js
var modularity = Modularity()
modularity.addSrc('Cookies', 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js');
modularity.addSrc('axios', 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');

modularity.wait(['Cookies'], ([Cookies]) => {
  modularity.add('Cookies2',(done)=>{
    done({});
  })
});
modularity.wait(['Cookies', 'axios'], ([Cookies, axios]) => {
  console.log('axios', axios);
});
modularity.wait(['Cookies2'], ([Cookies2]) => {
  console.log('Cookies2', Cookies2)
});
```
