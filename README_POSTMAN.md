# Testes Postman para o Devagram

Este diretório contém uma coleção de testes para o Postman que permite testar a API do Devagram.

## Como usar

1. Instale o [Postman](https://www.postman.com/downloads/)
2. Importe a coleção `Devagram_Postman_Collection.json`
3. Crie um ambiente no Postman com as seguintes variáveis:
   - `token` (deixe vazio, será preenchido automaticamente)
   - `userId` (deixe vazio, será preenchido automaticamente)

## Preparando uma imagem de teste

Antes de executar os testes, você precisa de uma imagem para testar o upload. Você pode usar qualquer imagem JPEG ou PNG.

1. Renomeie sua imagem para `test-image.jpg`
2. Coloque-a no mesmo diretório onde você executa o Postman

## Executando os testes

1. Execute os testes na ordem numérica:
   - 1. Login - Faz login e obtém o token JWT
   - 2. Verificar Usuário - Verifica se o usuário está autenticado
   - 3. Publicação Simples - Testa a criação de publicação sem redimensionamento
   - 4. Publicação Normal - Testa a criação de publicação com redimensionamento
   - 5. Verificar Feed - Verifica se as publicações aparecem no feed
   - 6. Verificar Perfil - Verifica se as publicações aparecem no perfil
   - 7. Teste de Redimensionamento - Testa apenas o redimensionamento de imagens
   - 8. Teste de Upload Simples - Testa apenas o upload de imagens
   - 9. Teste S3 - Verifica a conexão com o S3

## Observações

- O teste de login configura automaticamente as variáveis `token` e `userId`
- Os testes subsequentes usam essas variáveis para autenticação
- Se o login falhar, os outros testes também falharão

## Solução de problemas

Se os testes de publicação falharem:

1. Verifique se o servidor está rodando
2. Verifique se as credenciais do S3 estão configuradas corretamente
3. Verifique se a imagem de teste é válida e não muito grande
4. Execute o teste "9. Teste S3" para verificar a conexão com o S3