# 🔐 Credentials Management

This directory contains templates and documentation for managing API keys and credentials securely.

## 🛡️ Security Best Practices

1. **Never commit actual credentials** to Git
2. **Use environment variables** for sensitive data
3. **Keep separate credentials** for development and production
4. **Rotate keys regularly** and revoke unused ones

## 📁 Files in this directory

- `env.example` - Template for environment variables
- `google-cloud-vision.json.example` - Template for Google Cloud credentials
- `README.md` - This documentation

## 🚀 Quick Setup

### 1. Copy the example files
```bash
# Copy environment template
cp credentials/env.example .env

# Copy Google Cloud template (if using)
cp credentials/google-cloud-vision.json.example credentials/google-cloud-vision.json
```

### 2. Fill in your actual keys
Edit `.env` with your real API keys:
```bash
# Edit the .env file
nano .env
```

### 3. Load environment variables
```bash
# For current session
source .env

# Or export individually
export OPENAI_API_KEY="your-actual-key-here"
```

## 🔑 Required API Keys

### OpenAI API Key (Required)
- **Purpose**: AI text extraction and enhancement
- **Get it**: https://platform.openai.com/api-keys
- **Format**: `sk-...` (starts with sk-)
- **Cost**: Pay-per-use, ~$0.01-0.03 per image

### Google Cloud Vision (Optional)
- **Purpose**: Enhanced OCR accuracy
- **Get it**: https://cloud.google.com/vision/docs/setup
- **Format**: JSON service account file
- **Cost**: First 1,000 requests/month free

### Vercel Token (Optional)
- **Purpose**: Automated deployments
- **Get it**: https://vercel.com/account/tokens
- **Format**: `vercel_...`

## 💰 Cost Estimation

For ~85 logbook pages:
- **OpenAI Vision**: ~$2-5 total
- **OpenAI GPT-4**: ~$1-3 total
- **Google Vision**: Free (under 1,000 images)

## 🔒 Security Notes

- The `.env` file is already in `.gitignore`
- Never share your API keys in chat, email, or screenshots
- If you accidentally commit a key, revoke it immediately
- Use different keys for development and production

## 🛠️ Troubleshooting

**"API key not found"**
```bash
# Check if .env file exists
ls -la .env

# Check if variable is loaded
echo $OPENAI_API_KEY
```

**"Permission denied"**
```bash
# Make sure file permissions are correct
chmod 600 .env
chmod 600 credentials/google-cloud-vision.json
``` 