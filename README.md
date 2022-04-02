# Blinker

This is a simple tool for checking IP addresses from domain names, which you can set in to `config.yml` in `targets` scope:

```
...
  targets:
    role1:
      name: 'github'
      domain: 'github.com'
    role2:
      name: 'google'
      domain: 'google.com'
    role3:
      name: 'cloudflare'
      domain: 'cloudflare.com'
```

Run app:
```
node app.js
```

Output:
```
Host: github.com. IP: 140.82.121.3. Host name: lb-140-82-121-3-fra.github.com. Average: 97.968
Host: google.com. IP: 142.250.185.174. Host name: fra16s51-in-f14.1e100.net. Average: 97.787
Host: cloudflare.com. IP: 104.16.132.229. Host name: (not found). Average: 97.559
Host: cloudflare.com. IP: 104.16.133.229. Host name: (not found). Average: 97.681
```