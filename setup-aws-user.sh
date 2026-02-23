#!/bin/bash

echo "🚀 Criando usuário AWS para projeto Sphere..."

# 1. Criar usuário
echo "📝 Criando usuário sphere-app..."
aws iam create-user --user-name sphere-app --tags Key=Project,Value=Sphere Key=Environment,Value=Production

# 2. Criar política personalizada para S3
echo "📋 Criando política S3 personalizada..."
cat > sphere-s3-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::midia-devaria/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::midia-devaria"
            ]
        }
    ]
}
EOF

aws iam create-policy --policy-name SphereS3Access --policy-document file://sphere-s3-policy.json

# 3. Anexar política ao usuário
echo "🔗 Anexando política ao usuário..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws iam attach-user-policy --user-name sphere-app --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/SphereS3Access

# 4. Criar Access Key
echo "🔑 Criando Access Key..."
aws iam create-access-key --user-name sphere-app --output table

echo ""
echo "✅ Usuário sphere-app criado com sucesso!"
echo "📝 Copie as credenciais acima e cole no arquivo .env do backend:"
echo ""
echo "AWS_ACCESS_KEY_ID=AKIA..."
echo "AWS_SECRET_ACCESS_KEY=..."
echo ""
echo "🧹 Limpando arquivos temporários..."
rm sphere-s3-policy.json

echo "🎉 Configuração concluída!"