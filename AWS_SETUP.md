# AWS Fargateデプロイセットアップガイド

このドキュメントでは、このアプリケーションをAWS Fargateにデプロイするための手順を説明します。

## 🔐 認証方式：OIDC（OpenID Connect）

このセットアップでは、セキュリティのベストプラクティスとして**AWS IAM OIDC**を使用します。

### OIDCの利点
- ✅ 長期的なアクセスキー不要（セキュリティリスク削減）
- ✅ 自動的なクレデンシャルローテーション
- ✅ GitHub Actionsとの直接統合
- ✅ 最小権限の原則を適用しやすい

## 📋 前提条件

- AWSアカウント
- AWS CLIインストール（ローカル設定用）
- 管理者権限またはIAM、ECR、ECS作成権限

## 🚀 セットアップ手順

### 1. ECRリポジトリの作成

Dockerイメージを保存するためのECRリポジトリを作成します。

```bash
aws ecr create-repository \
  --repository-name ai-development-workflow \
  --region ap-northeast-1
```

作成後、リポジトリURIをメモしてください（例：`123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/ai-development-workflow`）

### 2. GitHub Actions用のIAM OIDC IDプロバイダーを作成

GitHubとAWSの信頼関係を確立します。

#### 2.1 OIDCプロバイダーの作成

AWS CLIまたはAWSマネジメントコンソールで以下を実行：

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

#### 2.2 IAMロールの作成

`github-actions-fargate-role.json`という名前で以下の信頼ポリシーを作成：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/ai-development-workflow:*"
        }
      }
    }
  ]
}
```

**重要**: 以下を置き換えてください：
- `YOUR_ACCOUNT_ID`: AWSアカウントID（12桁）
- `YOUR_GITHUB_USERNAME`: GitHubユーザー名またはOrganization名

ロールを作成：

```bash
aws iam create-role \
  --role-name GitHubActionsFargateDeployRole \
  --assume-role-policy-document file://github-actions-fargate-role.json
```

#### 2.3 IAMポリシーの作成とアタッチ

`github-actions-fargate-policy.json`という名前で以下のポリシーを作成：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:UpdateService",
        "ecs:DescribeServices"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
        "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskRole"
      ]
    }
  ]
}
```

**重要**: `YOUR_ACCOUNT_ID`を置き換えてください。

ポリシーを作成してロールにアタッチ：

```bash
aws iam create-policy \
  --policy-name GitHubActionsFargateDeployPolicy \
  --policy-document file://github-actions-fargate-policy.json

aws iam attach-role-policy \
  --role-name GitHubActionsFargateDeployRole \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/GitHubActionsFargateDeployPolicy
```

### 3. ECS Fargateクラスターの作成

```bash
aws ecs create-cluster \
  --cluster-name ai-development-workflow-cluster \
  --region ap-northeast-1
```

### 4. タスク実行ロールの作成

ECS Fargateタスクの実行に必要なIAMロールを作成します。

#### 4.1 信頼ポリシーの作成

`ecs-task-execution-role.json`という名前で以下を作成：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### 4.2 ロールを作成してポリシーをアタッチ

```bash
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://ecs-task-execution-role.json

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### 5. タスク定義の作成

`task-definition.json`という名前で以下を作成：

```json
{
  "family": "ai-development-workflow-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "ai-development-workflow-app",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/ai-development-workflow:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ai-development-workflow",
          "awslogs-region": "ap-northeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

**重要**: `YOUR_ACCOUNT_ID`を置き換えてください。

CloudWatch Logsグループを作成：

```bash
aws logs create-log-group \
  --log-group-name /ecs/ai-development-workflow \
  --region ap-northeast-1
```

タスク定義を登録：

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region ap-northeast-1
```

### 6. Application Load Balancerの作成（推奨）

パブリックアクセスとヘルスチェックのためにALBを作成します。

#### 6.1 セキュリティグループの作成

```bash
# ALB用セキュリティグループ
aws ec2 create-security-group \
  --group-name alb-sg \
  --description "Security group for ALB" \
  --vpc-id YOUR_VPC_ID

# HTTP（80）トラフィックを許可
aws ec2 authorize-security-group-ingress \
  --group-id ALB_SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# ECSタスク用セキュリティグループ
aws ec2 create-security-group \
  --group-name ecs-tasks-sg \
  --description "Security group for ECS tasks" \
  --vpc-id YOUR_VPC_ID

# ALBからのトラフィックのみ許可
aws ec2 authorize-security-group-ingress \
  --group-id ECS_TASKS_SG_ID \
  --protocol tcp \
  --port 80 \
  --source-group ALB_SG_ID
```

#### 6.2 ALBの作成

```bash
aws elbv2 create-load-balancer \
  --name ai-development-workflow-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups ALB_SG_ID \
  --scheme internet-facing \
  --type application \
  --region ap-northeast-1
```

#### 6.3 ターゲットグループの作成

```bash
aws elbv2 create-target-group \
  --name ai-development-workflow-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id YOUR_VPC_ID \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region ap-northeast-1
```

#### 6.4 リスナーの作成

```bash
aws elbv2 create-listener \
  --load-balancer-arn ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=TARGET_GROUP_ARN \
  --region ap-northeast-1
```

### 7. ECSサービスの作成

```bash
aws ecs create-service \
  --cluster ai-development-workflow-cluster \
  --service-name ai-development-workflow-service \
  --task-definition ai-development-workflow-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[ECS_TASKS_SG_ID],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=TARGET_GROUP_ARN,containerName=ai-development-workflow-app,containerPort=80" \
  --region ap-northeast-1
```

**重要**:
- `subnet-xxxxx,subnet-yyyyy`: 実際のパブリックサブネットIDに置き換え
- `ECS_TASKS_SG_ID`: ステップ6.1で作成したセキュリティグループID
- `TARGET_GROUP_ARN`: ステップ6.3で作成したターゲットグループARN

### 8. GitHub Secretsの設定

GitHubリポジトリに以下のSecretを追加します：

1. リポジトリの**Settings** → **Secrets and variables** → **Actions**へ移動
2. **New repository secret**をクリック
3. 以下のSecretを追加：

| Name | Value |
|------|-------|
| `AWS_ROLE_ARN` | `arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsFargateDeployRole` |

**注意**: ワークフローファイル（`.github/workflows/deploy-fargate.yml`）内の環境変数も必要に応じて調整してください。

## 🔧 ワークフロー設定のカスタマイズ

`.github/workflows/deploy-fargate.yml`の以下の環境変数を環境に合わせて調整：

```yaml
env:
  AWS_REGION: ap-northeast-1                          # AWSリージョン
  ECR_REPOSITORY: ai-development-workflow             # ECRリポジトリ名
  ECS_SERVICE: ai-development-workflow-service        # ECSサービス名
  ECS_CLUSTER: ai-development-workflow-cluster        # ECSクラスター名
  ECS_TASK_DEFINITION: ai-development-workflow-task   # タスク定義名
  CONTAINER_NAME: ai-development-workflow-app         # コンテナ名
```

## 🧪 ローカルでのDockerテスト

デプロイ前にローカルでDockerイメージをテストできます：

```bash
# イメージのビルド
docker build -t ai-development-workflow:local .

# コンテナの起動
docker run -p 8080:80 ai-development-workflow:local

# ブラウザで http://localhost:8080 にアクセス
# ヘルスチェック: http://localhost:8080/health
```

## 📊 デプロイ後の確認

1. **ECSサービスの状態確認**:
   ```bash
   aws ecs describe-services \
     --cluster ai-development-workflow-cluster \
     --services ai-development-workflow-service \
     --region ap-northeast-1
   ```

2. **ALBのDNS名確認**:
   ```bash
   aws elbv2 describe-load-balancers \
     --names ai-development-workflow-alb \
     --region ap-northeast-1 \
     --query 'LoadBalancers[0].DNSName' \
     --output text
   ```

3. **CloudWatch Logsの確認**:
   - AWSマネジメントコンソール → CloudWatch → Log groups → `/ecs/ai-development-workflow`

## 🔄 更新とデプロイ

mainブランチにプッシュすると、GitHub Actionsが自動的に：
1. Dockerイメージをビルド
2. ECRにプッシュ
3. 新しいタスク定義を登録
4. ECSサービスを更新
5. ローリングアップデートを実行

## 💰 コスト見積もり

最小構成（1タスク、0.25 vCPU、0.5 GB RAM）での月額概算：
- Fargate: 約$15-20
- ALB: 約$20-25
- ECR: 約$1-5（イメージサイズによる）
- データ転送: 従量課金

**合計**: 約$40-50/月

## 🛠 トラブルシューティング

### デプロイが失敗する

1. **IAMロールARNの確認**: GitHub SecretsのAWS_ROLE_ARNが正しいか確認
2. **権限の確認**: IAMポリシーに必要な権限がすべて含まれているか確認
3. **ECRリポジトリの確認**: リポジトリが存在し、正しいリージョンにあるか確認

### タスクが起動しない

1. **CloudWatch Logsを確認**: アプリケーションのエラーログを確認
2. **タスク定義を確認**: CPU、メモリ、イメージURIが正しいか確認
3. **ネットワーク設定を確認**: サブネット、セキュリティグループが正しいか確認

### ヘルスチェックが失敗する

1. nginxのヘルスチェックエンドポイント（`/health`）が正しく応答しているか確認
2. セキュリティグループでポート80が開いているか確認
3. タスク定義のヘルスチェック設定を調整（`startPeriod`を延長）

## 📚 参考リンク

- [AWS Fargate Documentation](https://docs.aws.amazon.com/fargate/)
- [GitHub Actions OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [Amazon ECS Task Definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
