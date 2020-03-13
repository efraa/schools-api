# Schools API 🚀

Core of School Management System, built with TypeScript.

## Developing & Running

### Requisites

* Node >=10.x.
* Yarn
* Docker

### API Docs

[Documentation](https://documenter.getpostman.com/view/7831505/S1Zw6VCU?version=latest)

### Get Started

1. clone this repo
2. Move to the cloned directory.

### Running API Server alone to consume (Frontend development)

3. copy ``` prod.env ``` to ``` .env ```
4. run ``` yarn && yarn build && yarn start ```

**Your API should be ready on port 2302**

``` localhost:2302/api/v1 ```


### Or running API Server to development

3. copy ``` development.env ``` to ``` .env ```
4. run ``` yarn install && docker-compose up --build ```


### Running workers

The workers must be launched in a process other than API server,
once API is running it can execute workers in a terminal.

_Open a terminal_

**Development**

run ``` docker exec SCHOOLS_API yarn worker ```

**Consume (Frontend)**

run ``` yarn worker ```

### Ready

**API SERVER**

``` localhost:2302/api/v1 ```

**SOCKET SERVER**

``` localhost:2302 ```

## Conventional Commits

* **build**: Changes that affect the build system or external dependencies (example scopes: yarn, npm).
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, Docker).
* **docs**: Documentation only changes.
* **feat**: A new feature.
* **fix**: A bug fix.
* **perf**: A code change that improves performance.
* **refactor**: A code change that neither fixes a bug nor adds a feature.
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
* **test**: Adding or correcting tests.

### Contributors

* [Efra Peralta](https://github.com/Efraa)