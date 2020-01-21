# 💰 Awesome Billing and Payments

In a Standford class on [Cloud computing overview](http://web.stanford.edu/class/cs349d/docs/L01_overview.pdf), the software stack is presented as such:

![](cloud-software-stack-billing.jpg)

This knowledge base cover the far second far right perimeter of the cloud stack. It is one of the pillar of the cloud ecosystem, bridging the customers, the products and the business. The [other pillar being Identity and Access Management (IAM)](https://github.com/kdeldycke/awesome-iam/).


## Contents

- [Basics](#basics)
- [Pricing](#pricing)
- [Product Catalog](#product-catalog)
- [Calculator](#calculator)
- [Cost Forecast](#cost-forecast)
- [Marketplace](#marketplace)
  - [Cloud Resources](#cloud-resources)
  - [Online Ads](#online-ads)
- [Accounting](#accounting)
- [Credits / Coupons / Vouchers](#credits--coupons--vouchers)
- [Taxes](#taxes)
- [Invoice](#invoice)
- [Payments](#payments)
- [Receipt](#receipt)
- [Credit Cards](#credit-cards)
- [Fraud](#fraud)
- [UX/UI](#ux-ui)
- [KPIs](#kpis)
- [Competitive Analysis](#competitive-analysis)
- [History](#history)
- [Others](#others)


## Basics

- [Open guide to AWS Billing and Cost Management](https://github.com/open-guides/og-aws#billing-and-cost-management)
- [Major use-cases for cloud services from a ROI standpoint](https://news.ycombinator.com/item?id=19830022)


## Pricing

From monthly subscription to commodity-like on-the-go consumption, and including shopping-cart like funnel, there's plenty of scheme out there to structure your product's pricing.

- [Pricing Psychology](https://www.nickkolenda.com/psychological-pricing-strategies/) - Which numbers should you use? How high should it be? Should it be rounded? This guide has 42 tricks to help you choose the best price.
- [Pricing niche products](https://kevinlynagh.com/notes/pricing-niche-products/) - `The most compelling argument against simply picking a price, though, is that it limits how much you can learn about your market.`.
- `Billing is not complex on purpose: it's the price to pay for elasticity.` ([source](https://twitter.com/kdeldycke/status/1214160678363246592)) - Or why you'll never have an endless stream of complaning users if choosing utility pricing scheme.
- [Reconcile Your Monthly GCP Invoice with BigQuery Billing Export](https://medium.com/@lukwam/reconcile-your-monthly-gcp-invoice-with-bigquery-billing-export-b36ae0c961e) - Behind the quest of this developer to track its expenses, you get a glimpse on cloud billing difficulties. While not explicitely pointed out, pricing cloud resources is hard and the result of quantization, granularity and rounding, between space, time and currencies.
- [Google Ads API: `BillingCap` enum](https://developers.google.com/ad-manager/api/reference/v201911/CompanyService.BillingCap) - Capped actuals: monthly with rollover, an optimized pricing scheme to limit surprises from customers.
- [AWS EC2 T2 Instances Demystified: Don't Learn The Hard Way](https://roberttisdale.com/aws-ec2-t2-instances-demystified-dont-learn-hard-way/) - An example of really tricky burstable instances which accrues and limits its own amount of CPU usage credits.


## Product Catalog

The central repository of all available services, products, variants, options and pricing available to the customer to purchase.

- [GCP Product Catalog](https://cloud.google.com/blog/products/gcp/introducing-cloud-billing-catalog-api-gcp-pricing-in-real-time)


## Calculator

- [Cloud Cost Calculator](https://github.com/scalyr/cloud-costs) - Web-based tool for finding the cheapest cloud servers for a given set of requirements.
- [Cloud Computing Comparison Engine](https://www.cloudorado.com)
- [EC2Instances.info](https://ec2instances.info) - Easy Amazon EC2 Instance Comparison.


## Cost Forecast

To provide visibility to customers on metered, utility-like billing pricing scheme, having a way to forecast costs is required.

- [GCP Cost Forecast](https://cloudplatform.googleblog.com/2018/07/predict-your-future-costs-with-google-cloud-billing-cost-forecast.html)
- [AWS Forecast product](https://aws.amazon.com/forecast/)
- [How to save money on your AWS bill](https://twitter.com/QuinnyPig/status/1091041507342086144).
- [Time Series Prediction - A short introduction for pragmatists](https://www.liip.ch/en/blog/time-series-prediction-a-short-comparison-of-best-practices) - [Facebook's Prophet](https://facebook.github.io/prophet/) (which [uses Stan underneath](https://statmodeling.stat.columbia.edu/2017/03/01/facebooks-prophet-uses-stan/)), seems to be worth checking to implement a cost forecast tool while taking care of seasonality.


## Marketplace

A marketplace connect supply with demand that lead to a financial transaction. If there is no payment involved, then it is an aggregator, or a hub. Not a marketplace.

- [Papers we love: Auctions and Bidding](https://github.com/papers-we-love/papers-we-love/tree/master/economics#auctions-and-bidding) - A collection of papers on bidding and auctions. 
- How to Kickstart and Scale a Marketplace Business: [Constrain the marketplace](https://www.lennyrachitsky.com/p/how-to-kickstart-and-scale-a-marketplace); Decide which side of the marketplace to concentrate on; Drive initial supply; Drive initial demand. A 4-parts series with dozen of interviews of people with direct experience building and scaling marketplaces.
- [Vickrey auction](https://en.wikipedia.org/wiki/Vickrey_auction) - Hinted by an [HN comment](https://news.ycombinator.com/item?id=19145391), in which yes, `"Asking people what they'd pay for and how much rarely works." (...) [but] using a Vickrey auction, similar to Google's ad auction mechanism, can elicit a person's maximum willingness-to-pay.`.

### Cloud Resources

This sub-section focus on bid/ask mechanism matching resource producer with consumers. Most of the time these are one-sided markets with the big platform trying to amortized under-utilized inventory.

- [Pricing of Service in Clouds: Optimal Response and Strategic Interactions](http://www.sigmetrics.org/mama/2013/abstracts2013/UrgaonkarEtAl.pdf) - `How should the consumer modulate its demand to optimize its profits? (...) How should the provider and consumer negotiate the specific pricing structure they will employ?` Covers non-linear models, tiered pricing, elastic demand, consumer et provider strategies.
- [Present or Future: Optimal Pricing for Spot Instances](https://web.archive.org/web/20150708151037/http://www.temple.edu/cis/icdcs2013/data/5000a410.pdf) - `Pricing policy of spot resources should be carefully designed and the impact on both present and future should be considered.`.
- `You always pay the spot market price, not your bid.` ([source](https://news.ycombinator.com/item?id=20347716)) - Simple explanation of the bidding mechanism.
- [Deconstructing Amazon EC2 Spot Instance Pricing](http://www.cs.technion.ac.il/~dan/papers/Spotprice11CloudCom.pdf) - `Cloud providers possessing large quantities of spare capacity must either incentivize clients to purchase it or suffer losses. Amazon is the first cloud provider to address this challenge, by allowing clients to bid on spare capacity and by granting resources to bidders while their bids exceed a periodically changing spot price.`.
- [GCP Preemptible VMs vs AWS Spot Instances](https://news.ycombinator.com/item?id=9564287).
- `Look at the 3-month spot price history to estimate cost and to discover combinations of availability zone and instance type with extra capacity.` ([source](https://news.ycombinator.com/item?id=16071684)) - TL;DR: users are seeking more transparency on the spot market.
- [The Eternal Cost Savings Of Netflix's Internal Spot Market](http://highscalability.com/blog/2017/12/4/the-eternal-cost-savings-of-netflixs-internal-spot-market.html) - When you're big enough that [creating an internal secondary market](https://medium.com/netflix-techblog/creating-your-own-ec2-spot-market-6dd001875f5) for instances makes economic sense.
- [AutoSpotting](https://github.com/AutoSpotting/AutoSpotting) - Tool that easily and reliably converts (all) your existing AutoScaling groups to cheaper spot instances.

### Online Ads

Targeted online advertisements maketplaces have a lot in common with traditional cloud marketplace. Some good inpiration there, from concepts to tech

- [RTB Budget Pacing Summarized](https://github.com/PragmaticLab/RTB_Budget_Pacing_Summarized) - A collection of budget pacing resources for targeted online advertisements.
- [Samsung's online ads platform/exchange war story](https://github.com/eloraiby/fs-pacer/blob/master/fs-pacer.md) - How to scale to 5M bid request/s, 2ms Max Response Time.
- [`RTB4Free`](https://github.com/RTB4FREE) - Open Source Bidder and Demand Side Platform (DSP).


## Accounting

- [Accounting for Developers 101](https://docs.google.com/document/d/1HDLRa6vKpclO1JtxbGB5NeAYWf8cf1UMGy22o8OZZq4).
- [Accounting for Computer Scientists](https://martin.kleppmann.com/2011/03/07/accounting-for-computer-scientists.html).
- [Algebraic Models for Accounting Systems](https://www.amazon.com/Algebraic-Models-For-Accounting-Systems/dp/9814287113) - This book is about the application of abstract algebra to the analysis of accounting systems.
- [So, you want to learn Bookkeeping!](http://www.dwmbeancounter.com/tutorial/Tutorial.html) - Learn accounting & bookkeeping for free.
- [Accounts Demystified: The Astonishingly Simple Guide To Accounting](https://www.amazon.co.uk/Accounts-Demystified-Astonishingly-Simple-Accounting/dp/0273744704/).
- [Tutorial on multiple currency accounting](https://www.mathstat.dal.ca/~selinger/accounting/tutorial.html) - An excellent resource for implementing multi-currency accounting systems.
- [Financial Intelligence for Entrepreneurs: What You Really Need to Know About the Numbers](https://www.amazon.com/Financial-Intelligence-Entrepreneurs-Really-Numbers/dp/1422119157).
- [Plain text accounting tools](https://plaintextaccounting.org/#software) - Extensive list of open-source personal finance projects that might be great to look into for inspiration on double-entry accounting and bookkeeping.
- And a list of graphical accounting tools: [GNUCash](https://gnucash.org) (GTK+), [Grisbi](https://grisbi.org) (C), [Firefly III](https://firefly-iii.org) (PHP).
- [Django Hordak](https://django-hordak.readthedocs.io) - Core functionality of a double entry accounting system for Django.
- [GnuCash Tutorial and Concepts Guide](https://www.gnucash.org/docs/v2.4/C/gnucash-guide/) - A complete tutorial on personal finance tracking with GnuCash.
- [Books, an immutable double-entry accounting database service](https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/) - Explain the basic data model of a double-entry accounting system relying on Google Spanner for internal use at Square.


## Credits / Coupons / Vouchers

- [Quantity discounts on a virtual good: The results of a massive pricing experiment](https://www.pnas.org/content/pnas/113/27/7323.full.pdf) - `Implementing price reductions ranging from 9–70% for large purchases, we found re- markably little impact on revenue, either positively or negatively.`.
- [Raising Prices is Hard](https://www.backblaze.com/blog/raising-prices-is-hard/) - Backblaze post-mortem on raising prices on their main offer. They wanted to create an extension program based on credit system. This became a full-time job for a handful of their most senior engineers, and resulted in a six month project.
- [Details on Expiring DigitalOcean Credits](https://blog.digitalocean.com/details-on-expiring-digitalocean-credits/) - The reason you have to add an time limit on credits: unused ones accounts as liabilities on our balance sheet.
- [Hacking Scooters: How I Created $100k Worth Of Free Rides](https://webcache.googleusercontent.com/search?q=cache:7hrzYYk5-IwJ:https://fant.io/p/hacking-voi/) - A cautionary tale on how promo codes can be exploited to get unlimited free rides.


## Taxes

- [Council Directive 2006/112/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L:2006:347:FULL) - European Union reference on the common system of VAT.
- [{Digital,Cloud,Electronic,Online} Services VAT Rate Database](https://github.com/kdeldycke/vat-rates) - Centralize applicable VAT rates on foreign online services, for each country of residence (including territorial exceptions).


## Invoice

The invoice materialize a consumed service or purchased product, wiating to be settled by a payment transaction.

- [On GCP invoiced billing](https://news.ycombinator.com/item?id=17517479) - [Invoiced billing](https://cloud.google.com/billing/docs/how-to/invoiced-billing) (B2B-friendly payment by the customer after the service is consumed and an invoice issued) is a pain on GCP.
- [Digital signatures: how Sleek leverages Cloud HSM to guarantee the integrity of legal documents](https://medium.com/google-developers/digital-signatures-how-sleek-leverages-cloud-hsm-to-guarantee-the-integrity-of-legal-documents-a7bd3b82faf6) - Here is a great way to rely on GCP's HSM to digitally sign documents and provide an immutable audit-trail. Might be applied to invoices as well as contract agreements.
- [OpenTimestamps](https://opentimestamps.org) - Go beyond the solution above, and timestamp immutable document directly on Bitcoin's blockchain.
- [Manta](https://github.com/hql287/Manta) - Flexible invoicing desktop app with beautiful & customizable templates.
- [InvoicePlane](https://github.com/InvoicePlane/InvoicePlane) - A self-hosted open-source application for managing your invoices, clients and payments.


## Payments

- [Monzo's bank transfers post-mortem](https://monzo.com/blog/2019/06/20/why-bank-transfers-failed-on-30th-may-2019/) - Or why you should be prepared for and work around gateway provider outages.
- [How to Build an Insurance Company](https://www.moderntreasury.com/journal/how-to-build-an-insurance-company) - The importance of payment ops architecture.
- [EU's Late Payment Directive](https://ec.europa.eu/growth/smes/support/late-payment_en) - European rules on applicable fees for late payments.
- [High failure rate of Point Of Sale devices in the upper Midwest](https://news.ycombinator.com/item?id=20043944) - The root cause? People wearing a lot of wool in low humidity air, generating a lot of static.
- How ACH works: A developer perspective, [part 1](https://engineering.gusto.com/how-ach-works-a-developer-perspective-part-1/), [part 2](https://engineering.gusto.com/how-ach-works-a-developer-perspective-part-2/), [part 3](https://engineering.gusto.com/how-ach-works-a-developer-perspective-part-3/), [part 4](https://engineering.gusto.com/how-ach-works-a-developer-perspective-part-4/).


## Receipt

A receipt materialize the payment transaction.

- [The humble receipt gets a brilliant redesign](https://www.fastcompany.com/90347782/the-humble-receipt-gets-a-brilliant-redesign) - When a Netflix data engineer revisit receipts.
- [The long, long history of long, long CVS receipts](https://www.vox.com/the-goods/2018/10/10/17956950/why-are-cvs-pharmacy-receipts-so-long)


## Credit Cards

The most popular payment device.

- ['Is that even legal?': Companies may be sharing new credit or debit card information without you knowing](https://www.cbc.ca/news/business/banking-information-shared-with-third-parties-1.5102931) - Some credit and debit card companies have "updating service" that allows new account numbers and expiry dates to be shared with merchants. Visa's implementation is called [VAU](https://developer.visa.com/capabilities/vau) and Mastercard's is [ABU](https://developer.mastercard.com/product/automatic-billing-updater).
- [Strong Customer Authentication](https://stripe.com/guides/strong-customer-authentication) - [Payment Services Directive](https://en.wikipedia.org/wiki/Payment_Services_Directive) 2, explained.
- [Address Verification System](https://en.wikipedia.org/wiki/Address_Verification_System) - A system checking the matching of customer's billing addresses with the one associated with the credit card.


## Fraud

There's monenatary incentives to exploit your business. Be prepared to fight shady users.

- [Awesome List of IAM: Fraud links](https://github.com/kdeldycke/awesome-iam#fraud) - Section dedicated to fraud management related to user accounts, from our sister repository.
- [The Secret Trust Scores Companies Use to Judge Us All](https://www.wsj.com/articles/the-secret-trust-scores-companies-use-to-judge-us-all-11554523206) - Nearly everything we buy, how we buy, and where we're buying from is secretly fed into AI-powered verification services that help companies guard against credit-card and other forms of fraud.
- [How Candy Japan got credit card fraud somewhat under control](https://www.candyjapan.com/behind-the-scenes/how-i-got-credit-card-fraud-somewhat-under-control) - Suggestions involved either [warning signals](https://www.candyjapan.com/behind-the-scenes/fraudulent-transaction-warning-signs) for trying to guess which orders might be fraud, or countermeasures to try to make things harder for the fraudsters.
- [Five Fun Fraud Facts](https://blog.sift.com/2013/five-ecommerce-fraud-facts/) - Another tiny collection of features we can feed to a ML system to detect fraud. Comments on HN also unearthed [more qualifying signals](https://news.ycombinator.com/item?id=6376350) and [derived geodata on the transaction](https://news.ycombinator.com/item?id=6376221).
- [Credit Card Fraud Detection using Autoencoders in Keras](https://medium.com/@curiousily/credit-card-fraud-detection-using-autoencoders-in-keras-tensorflow-for-hackers-part-vii-20e0c85301bd) - Tutorial on how to rely on anomaly detection to implement suspicious card transactions.
- [How credit card thieves use free-to-play apps to launder gains](https://kromtech.com/blog/security-center/digital-laundry) -  To prevent abuses, service provider must strenghen both credit card verification and the account creation process.
- [GCP improved account management policies to better support customers](https://cloudplatform.googleblog.com/2018/07/improving-our-account-management-policies-to-better-support-customers.html) - Or why relying too much on fraud automation might lead to disgruntled users.
- [Digital Ocean's Update on Customer Shutdown Incident](https://blog.digitalocean.com/an-update-on-last-weeks-customer-shutdown-incident/) - Aggressively shuting down user servers is good from a business point of view to prvent fraudster abusing free resources, until it's not.
- [CEO Fraud](https://www.knowbe4.com/ceo-fraud) - A billing team responsible for collecting payment is prey to this kind of fraud, in which the CEO is impersonated to commend exceptional payment transactions.


## UX/UI

Users gets easely angry when it comes to money. UX and UI might helps a lot to reduce frustration.

- [Apple Subscriptions HIG](https://developer.apple.com/design/human-interface-guidelines/subscriptions/overview/) - Guide and recommendation on how to make [auto-renewable subscriptions](https://developer.apple.com/app-store/subscriptions/) user-friendly.
- [Which has a higher conversion rate: A single long ecommerce checkout form or a multi-step one?](https://capitalandgrowth.org/questions/2055/which-has-a-higher-conversion-rate-a-single-long-e.html) - Focus first on other things in the cart, like easing anxiety and second-guessing by adding reassurance (trust marks, testimonials) near the credit card and completion steps, as well as some guarantee language that you may have used earlier in the product exploration process.


## KPIs

As stakeholder of the billing pipeline, you sat on all the critical data to measure and report on the health of the business.

- [12 KPIs you must know before pitching your startup](https://techcrunch.com/2017/02/04/12-kpis-you-must-know-before-pitching-your-startup/) - The 2 critical metrics being Customer Acquisition Cost (CAC) and Customer Lifetime Value (CLV).
- [You're all calculating churn rates wrong](https://medium.com/swlh/youre-all-calculating-churn-rates-wrong-cbab072cd992) - Churn rate is not a meaningful metric, as during the customer lifetime the churn probability is not constant. Most of the time because of your free trial and vouchers.
- [Analyzing Churn Rates, Free Trials, and Other Metrics](https://jlongster.com/analyizing-profit-metrics) - `I didn't know anything about how to determine pricing or structure plans. My background is software development — finding insights in the mixture of churn rates, free trials, and all these other metrics seemed like magic.`.
- [Churn Prediction](https://towardsdatascience.com/churn-prediction-3a4a36c2129a) - `How to use Python in a simplistic way to fuel your company's growth by applying the predictive approach to all your actions.`
- [RFM (customer value)](https://en.wikipedia.org/wiki/RFM_%28customer_value%29) - A way to segment users based on Recency, Frequency and Monetary value.


## Competitive Analysis

A bunch of resources to keep track of the current status and progress of all companies operating in the domain.

- [AWS Cost Management announcements](https://aws.amazon.com/about-aws/whats-new/aws-cost-management/).
- [AWS reserved instances vs saving plan](https://www.prosperops.com/assets/img/blog/ris_and_savings_plans.png).
- [EC2 Spot Price Tracker](https://github.com/grosskur/ec2price) - Web app that collects and graphs EC2 Spot Prices.
- [GCP billing release notes](https://cloud.google.com/billing/docs/release-notes).
- [GCP billing news](https://www.gcpweekly.com/gcp-resources/tag/billing/) - From the unofficial Google Cloud Platform newsletter.
- [DigitalOcean Platform changelog](https://www.digitalocean.com/docs/platform/release-notes/).


## History

- [The vanished grandeur of accounting](https://www.bostonglobe.com/ideas/2014/06/07/the-vanished-grandeur-accounting/3zcbRBoPDNIryWyNYNMvbO/story.html) -
Accounting paintings were a significant genre in Dutch art.


## Others

- https://keygen.sh  - Commercial service to sell and manage license keys.
- [Why not use Double or Float to represent currency?](https://stackoverflow.com/questions/3730019/why-not-use-double-or-float-to-represent-currency/3730040#3730040) - Because of precision: floats and doubles cannot accurately represent the base 10 multiples that we use for money.
