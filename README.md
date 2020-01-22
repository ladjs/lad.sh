# lad

[![build status](https://img.shields.io/travis/com/ladjs/lad.sh.svg)](https://travis-ci.org/ladjs/lad.sh)
[![code coverage](https://img.shields.io/codecov/c/github/ladjs/lad.sh.svg)](https://codecov.io/gh/ladjs/lad.sh)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lad](https://img.shields.io/badge/made_with-lad-95CC28.svg)](https://lad.js.org)

> Lad demo


## Table of Contents

* [Install](#install)
* [Run](#run)
  * [With docker](#with-docker)
  * [Without docker](#without-docker)
* [Contributors](#contributors)
* [License](#license)


## Install

```sh
git clone git@github.com:ladjs/lad.sh.git
cd lad.sh
npm install || yarn install
```


## Run

### With docker

#### Requirements

* Docker (see [install instruction](https://docs.docker.com/install/))

#### Run the app

```sh
# start mongo and redis
docker-compose up -d

# start web, api and bull queues
npm start all
```

### Without docker

#### Requirements

Please ensure your operating system has the following software installed:

* [Git][] - see [GitHub's tutorial][github-git] for installation

* [Node.js][node] (v10+) - use [nvm][] to install it on any OS

  * After installing `nvm` you will need to run `nvm install node`
  * We also recommend you install [yarn][], which is an alternative to [npm][]

* [MongoDB][] (v3.x+):

  * Mac (via [brew][]): `brew install mongodb && brew services start mongo`
  * Ubuntu:

    ```sh
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
    echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
    sudo apt-get update
    sudo apt-get -y install mongodb-org
    ```

* [Redis][] (v4.x+):

  * Mac (via [brew][]): `brew install redis && brew services start redis`
  * Ubuntu:

    ```sh
    sudo add-apt-repository -y ppa:chris-lea/redis-server
    sudo apt-get update
    sudo apt-get -y install redis-server
    ```

#### Run the app

```sh
npm start all
```


## Contributors

| Name             | Website                    |
| ---------------- | -------------------------- |
| **Nick Baugh**   | <http://niftylettuce.com/> |
| **Shaun Warman** | <https://shaunwarman.com/> |


## License

[Unlicensed](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

<a href="#"><img src="https://raw.githubusercontent.com/ladjs/lad/master/media/lad-footer.png" alt="#" /></a>

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[node]: https://nodejs.org

[nvm]: https://github.com/creationix/nvm

[mongodb]: https://www.mongodb.com/

[redis]: https://redis.io/

[github-git]: https://help.github.com/articles/set-up-git/

[git]: https://git-scm.com/

[brew]: https://brew.sh/
