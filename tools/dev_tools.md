# TODO
install scrip for dev tools

## Nodejs

We will use the LTS node version (aka V18).

Check if you use the rigth version with:
```sh
❯ node -v    
v18.18.1
```
```sh
❯ nvm current
v18.18.1
```

To install the rigth version use `nvm`

```sh
❯ nvm install --lts

Installing latest LTS version.
Downloading and installing node v18.18.1...
Downloading https://nodejs.org/dist/v18.18.1/node-v18.18.1-linux-x64.tar.xz...
####################### 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v18.18.1 (npm v9.8.1)
```

Dont forget to update npm after a version change

```sh
❯ npm update

up to date in 356ms
```