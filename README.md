# TES - Test Environment Sector
# Frontend
## Descrição
O TES é uma plataforma utilizada para criação de ambientes de desenvolvimento na nuvem.

## Requisitos
Estes são os requisitos da aplicação:
- [AWS CLI versão 2](https://aws.amazon.com/cli/)

## Implantação
- Crie um arquivo na raíz do projeto chamado de `env.js`.

- Cole o seguinte conteúdo no arquivo:
```javascript
export const env = Object.freeze({
    TES_API_BASE_URL: ""
})
```

- Configure o objeto `env`. Aqui esta uma descrição:
```text
BASE_URL: URL da api do TES implantada no Backend.
```