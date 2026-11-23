# A page to deploy the Vault; EC2 control; ephemeral deployments (2026-11-23T14:43Z)

Dinis, in a.maestro's session, about 14:55 UTC 23 November 2026, on the AWS programme (quotes are his):

## A dedicated page to deploy the Vault
- "Can we also look at creating a dedicated page just to deploy the Vault? ... if I have a customer that wants to deploy the Vault in their AWS account, we need a page that literally is as simple as possible."
- The flow he describes: "give me your account ID, maybe a couple of details. ... Log in here. Here's a Terraform script to run, so the CloudFormation script to run, and off you go." It ends with a DNS entry, "or maybe pick what domain you want". Then the result is "fully configured, just like this, in that region ... with everything configured, pointing to that particular ... account with DNS and maybe visualization on this."
- "This is a perfect example of this going to a much more DSL, domain-specific environment, which is really what matters. What matters is our ability to, for example, deploy, secure send very effectively. Well, the SC send API, which is the Vault."

## EC2 control and ephemeral deployments
- "We should also add the ability to deploy this using EC2 instances, like the ephemeral nature of it ... now we can manage EC2 instances very effectively ... So we need to add EC2 control to our environment. And then this will be another one of the deployments that we can do."
- "Some of these I would like to also start doing ephemerally. Start for a couple of hours, destroy, literally have a whole sort of workflow where we, for example, we should be able to move our deployments across regions every day."

## Routing
- **Who plans it:** to a.conductor.aws (account A), which assigns owners.
  - The deploy page: vaults.aws (the vault's design), cloudformation.aws (the stack), iam.aws (least privilege in the customer's account), dev.1/dev.2 (the page), ux.aws and sherpa.aws (as simple as possible), viz.aws (the visualisation).
  - EC2 control: a new area. The conductor says whether an ec2.aws agent is needed; a.maestro starts it.
- **Sites:** a new site goes through an IaC request on account C (factory.c, aws.c), as the nine area sites did.
- **What stays Dinis's:**
  - every real AWS change in his accounts (a plan, then his Approve);
  - a daily automation that creates and destroys real resources needs a decision page first (budget, regions, approval model) before it runs outside the twin;
  - in a customer's account, the customer runs the stack.
- **Twin first,** as for everything in this programme.
