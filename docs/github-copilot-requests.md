# Requests in GitHub Copilot

Learn about requests in Copilot, including premium requests, how they work, and how to manage your usage effectively.

## Important Notes

- **Premium requests for Spark and Copilot coding agent** are tracked in dedicated SKUs from November 1, 2025. This provides better cost visibility and budget control for each AI product.
- **Billing for premium requests** began on June 18, 2025, for all paid Copilot plans on GitHub.com, and on August 1, 2025, on GHE.com. The request counters were only set to zero for paid plans.
- **Premium request counters reset** on the 1st of each month at 00:00:00 UTC. See [Monitoring your GitHub Copilot usage and entitlements](https://docs.github.com/en/copilot/managing-copilot/monitoring-your-github-copilot-usage-and-entitlements).
- **Rate limits**: Certain requests may experience rate limits to accommodate high demand. Rate limits restrict the number of requests that can be made within a specific time period.

## What is a Request?

A request is any interaction where you ask Copilot to do something for you—whether it's generating code, answering a question, or helping you through an extension. Each time you send a prompt in a chat window or trigger a response from Copilot, you're making a request.

## What are Premium Requests?

Some Copilot features use more advanced processing power and count as premium requests. The number of premium requests a feature consumes can vary depending on the feature and the AI model used.

## Premium Features

The following Copilot features can use premium requests:

| Feature | Premium Request Consumption | SKU Attribution |
|---------|----------------------------|-----------------|
| **Copilot Chat** | Uses one premium request per user prompt, multiplied by the model's rate. This includes ask, edit, agent, and plan modes in Copilot Chat in an IDE. | Copilot premium requests |
| **Copilot CLI** | Each prompt uses one premium request with the default model. For other models, this is multiplied by the model's rate. | Copilot premium requests |
| **Copilot code review** | Each time Copilot reviews a pull request (when assigned as a reviewer) or reviews code in your IDE, one premium request is consumed. | Copilot premium requests |
| **Copilot coding agent** | Uses one premium request per session, plus one premium request for each real-time steering comment made during an active session. A session begins when you ask Copilot to create a pull request or make one or more changes to an existing pull request. | Copilot coding agent premium requests |
| **Copilot Spaces** | Uses one premium request per user prompt, multiplied by the model's rate. | Copilot premium requests |
| **Spark** | Each prompt uses a fixed rate of four premium requests. | Spark premium requests |
| **OpenAI Codex integration** | While in preview, each prompt uses one premium request multiplied by the model multiplier rates. | Copilot premium requests |

> **Tip**: For instructions on viewing how many premium requests you have used and advice on how to optimize usage, see [Monitoring your GitHub Copilot usage and entitlements](https://docs.github.com/en/copilot/managing-copilot/monitoring-your-github-copilot-usage-and-entitlements).

## Request Allowances Per Plan

### Copilot Free

- Up to **2,000 inline suggestion requests** per month
- Up to **50 premium requests** per month
- All chat interactions count as premium requests

### Paid Plans

- **Unlimited inline suggestions**
- **Unlimited chat interactions** using the included models (GPT-5 mini, GPT-4.1, and GPT-4o)
- Rate limiting is in place to accommodate high demand
- Monthly allowance of premium requests for advanced features

Premium requests can be used for:
- Advanced chat interactions
- Inline suggestions using premium models
- Other premium features

> **Note**: If a user has licenses from multiple enterprises or standalone organizations, they must make a selection using the "Usage billed to" dropdown in order to utilize premium requests. The billing entity selected will be billed for any premium requests they make.

## End of Month Policy

**Unused requests do not carry over.** Unused requests for the previous month do not roll over to the following month.

## What Happens When You Run Out of Premium Requests

> **Note**: Additional premium requests are not available to:
> - Users on Copilot Free (upgrade to a paid plan for more)
> - Users who subscribe, or have subscribed, to Copilot Pro or Copilot Pro+ through GitHub Mobile on iOS or Android

### For Paid Plan Users

If you use all of your premium requests, you can still use Copilot with one of the included models for the rest of the month. This is subject to change.

- Response times for included models may vary during periods of high usage
- Requests to included models may be subject to rate limiting

### Getting More Premium Requests

If you need more premium requests beyond your monthly allowance:

1. **For individual subscriptions**: Set a budget for additional premium requests or upgrade to a higher plan. See [Setting up budgets to control spending on metered products](https://docs.github.com/en/billing/managing-billing-for-your-products/setting-up-budgets-to-control-spending-on-metered-products).

2. **For enterprise or organization owners**: Ensure that the "Premium request paid usage" policy is enabled and that extra spending is not prevented by a budget. See [Managing the premium request allowance for your organization or enterprise](https://docs.github.com/en/copilot/managing-copilot/managing-premium-requests).

> **Important**: Accounts created before August 22, 2025 have a default $0 budget for Copilot premium requests. Premium requests over the allowance are rejected unless you edit or delete this budget.

> **Important**: Beginning December 2, 2025, account-level $0 Copilot premium request budgets for GitHub Enterprise and GitHub Team will be removed.

## Model Multipliers

Each model has a premium request multiplier based on its complexity and resource usage. If you are on a paid Copilot plan, your premium request allowance is deducted according to this multiplier.

**Included models** (GPT-5 mini, GPT-4.1, and GPT-4o) do not consume any premium requests on paid plans.

### Model Multiplier Table

| Model | Multiplier for Paid Plans | Multiplier for Copilot Free |
|-------|--------------------------|----------------------------|
| Claude Haiku 4.5 | 0.33 | 1 |
| Claude Opus 4.1 | 10 | Not applicable |
| Claude Opus 4.5 | 3 | Not applicable |
| Claude Sonnet 4 | 1 | Not applicable |
| Claude Sonnet 4.5 | 1 | Not applicable |
| Gemini 2.5 Pro | 1 | Not applicable |
| Gemini 3 Pro | 1 | Not applicable |
| GPT-4.1 | 0 | 1 |
| GPT-4o | 0 | 1 |
| GPT-5 | 1 | Not applicable |
| GPT-5 mini | 0 | 1 |
| GPT-5-Codex | 1 | Not applicable |
| GPT-5.1 | 1 | Not applicable |
| GPT-5.1-Codex | 1 | Not applicable |
| GPT-5.1-Codex-Mini | 0.33 | Not applicable |
| GPT-5.1-Codex-Max | 1 | Not applicable |
| Grok Code Fast 1 | 0.25 | Not applicable |
| Raptor mini | 0 | 1 |

> **Note**:
> - The models included with Copilot plans are subject to change.
> - Discounted multipliers are available for using Copilot auto model selection in Copilot Chat in VS Code.
> - If you are on a paid Copilot plan and use auto model selection, models qualify for a **10% multiplier discount**. For example, Sonnet 4 would be billed at 0.9x rather than 1x when using auto model selection.
> - Discounted multipliers are not available for Copilot Free.

## Examples of Premium Request Usage

Premium request usage is based on the model's multiplier and the feature you're using:

| Scenario | Calculation |
|----------|-------------|
| Using Claude Opus 4.1 in Copilot Chat | With a 10× multiplier, one interaction counts as **10 premium requests** |
| Using GPT-5 mini on Copilot Free | Each interaction counts as **1 premium request** |
| Using GPT-5 mini on a paid plan | **No premium requests** are consumed |

## Related Documentation

- [Plans for GitHub Copilot](https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot)
- [Rate limits for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-common-issues-with-github-copilot#rate-limiting)
- [Monitoring your GitHub Copilot usage and entitlements](https://docs.github.com/en/copilot/managing-copilot/monitoring-your-github-copilot-usage-and-entitlements)
