#!/bin/bash
token=$1
webhookUrl=$2

deleteWebhookUrl="https://api.telegram.org/bot${token}/deleteWebhook"
curl -X POST ${deleteWebhookUrl}

setWebhookUrl="https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}/${token}"
curl -X POST ${setWebhookUrl}
