# OpenRouter Configuration for TalentTrack HR System

## Environment Variables

Add the following to your `.env` file:

```env
# OpenRouter API Configuration
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Getting Your OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in to your account
3. Go to the [API Keys section](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key and add it to your `.env` file

## Available Models

OpenRouter provides access to multiple AI models. The current configuration uses:
- **Claude 3.5 Sonnet** (`anthropic/claude-3.5-sonnet`) - Excellent for complex reasoning and analysis

### Alternative Models Available:
- `qwen/qwen2.5-vl-32b-instruct:free` - OpenAI's GPT-4 Turbo
- `openai/gpt-3.5-turbo` - Faster, more cost-effective option
- `anthropic/claude-3-opus` - Most capable Claude model
- `anthropic/claude-3-haiku` - Fastest Claude model
- `google/gemini-pro` - Google's Gemini Pro
- `meta-llama/llama-3-70b-instruct` - Open source alternative

## Model Configuration

To change the AI model, update the model parameter in `src/services/ai/aiService.ts`:

```typescript
model: "anthropic/claude-3.5-sonnet", // Change this to your preferred model
```

## Pricing

OpenRouter offers competitive pricing with pay-per-use billing:
- Claude 3.5 Sonnet: ~$3-15 per 1M tokens
- GPT-4 Turbo: ~$10-30 per 1M tokens
- GPT-3.5 Turbo: ~$0.5-1.5 per 1M tokens

Check [OpenRouter Pricing](https://openrouter.ai/models) for current rates.

## Benefits of OpenRouter

1. **Model Flexibility**: Access to multiple AI providers through one API
2. **Cost Optimization**: Choose the best model for each use case
3. **Reliability**: Automatic failover between providers
4. **No Vendor Lock-in**: Easy to switch between models
5. **Unified Interface**: Single API for all models
6. **Rate Limiting**: Built-in rate limiting and retry logic

## Security Notes

- Never commit API keys to version control
- Use environment variables for API key storage
- Consider using backend proxy for production deployments
- Monitor API usage and set spending limits

## Testing

To verify the OpenRouter integration is working:

1. Add your API key to `.env`
2. Restart the development server
3. Open the AI chat bot in the dashboard
4. Ask a question like "Help me analyze candidates"
5. Check the browser console for any API errors

## Support

For OpenRouter support:
- Documentation: https://openrouter.ai/docs
- Discord: https://discord.gg/openrouter
- Email: help@openrouter.ai
