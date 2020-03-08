# Schools API 🚀

Core of Schools Management Application, built with TypeScript and served by docker.

### API Docs
---

[Documentation](https://documenter.getpostman.com/view/7831505/S1Zw6VCU?version=latest)

### Get Started
---

1. clone
2. move to ``` cd schools-api ```

### Running API Server alone to consume (Frontend development)
---

3. copy ``` prod.env ``` to ``` .env ```
4. run ``` yarn && yarn build && yarn start ```

**Your API should be ready on port 2302**

``` localhost:2302/api/v1 ```


### Or running API Server to development
---

3. copy ``` development.env ``` to ``` .env ```
4. run ``` yarn && docker-compose up --build ```


### Running workers

The workers must be launched in a process other than API server,
once API is running it can execute workers in a terminal.

_Open a terminal_

**Development**

run ``` docker exec SCHOOLS_API yarn worker ```

**Consume (Frontend)**

run ``` yarn worker ```

### Ready
---

**API SERVER**

``` localhost:2302/api/v1 ```

**SOCKET SERVER**

``` localhost:2302 ```