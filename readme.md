# 💰 Awesome Billing and Payments [![Awesome](https://awesome.re/badge-flat.svg)](https://github.com/sindresorhus/awesome)

<img align="right" width="50%" src="./cloud-software-stack-billing.jpg"/>

In a Stanford class on [Cloud computing overview](http://web.stanford.edu/class/cs349d/docs/L01_overview.pdf), the software architecture is described as in the right diagram:

This knowledge base cover the first of the far perimeter of the cloud stack. It is one of the pillar of the cloud ecosystem, where customers, products and business meets. The [other pillar being Identity and Access Management (IAM) 👤](https://github.com/kdeldycke/awesome-iam/).


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Basics](#basics)
- [Pricing](#pricing)
  - [Usage-based Pricing](#usage-based-pricing)
  - [Subscription Plans](#subscription-plans)
  - [Hybrid](#hybrid)
  - [Strategy](#strategy)
- [Product Catalog](#product-catalog)
- [Calculator](#calculator)
- [Cost Forecast](#cost-forecast)
- [Marketplace](#marketplace)
  - [Cloud Resources](#cloud-resources)
  - [Online Ads](#online-ads)
- [Accounting](#accounting)
  - [Double-Entry Model](#double-entry-model)
  - [Bookkeeping](#bookkeeping)
  - [Software design and implementation](#software-design-and-implementation)
  - [Analytics](#analytics)
  - [Currencies](#currencies)
- [Coupons and Vouchers](#coupons-and-vouchers)
- [Taxes](#taxes)
- [Invoice](#invoice)
- [Payments](#payments)
  - [Receipt](#receipt)
  - [Credit Cards](#credit-cards)
  - [Bank Accounts](#bank-accounts)
  - [Online Payments](#online-payments)
- [Fraud](#fraud)
  - [Cards](#cards)
  - [Trust Score](#trust-score)
  - [Statistics](#statistics)
  - [Billing](#billing)
- [UX/UI](#uxui)
- [Business Intelligence](#business-intelligence)
  - [Metrics](#metrics)
  - [Data Engineering](#data-engineering)
  - [Tools](#tools)
- [Competitive Analysis](#competitive-analysis)
- [Commercial Solutions](#commercial-solutions)
- [History](#history)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Basics

- [Open guide to AWS Billing and Cost Management](https://github.com/open-guides/og-aws#billing-and-cost-management)
- [Major use-cases for cloud services from a ROI standpoint](https://news.ycombinator.com/item?id=19830022)


## Pricing

From monthly subscription to commodity-like on-the-go consumption, and including shopping-cart like funnel, there's plenty of scheme out there to structure your product's pricing.

- [Don't just roll the dice – Software pricing guide](https://neildavidson.com/downloads/dont-just-roll-the-dice-2.0.0.pdf) - Not only huge and complete collection of pricing scheme, but also the psychological effect and impact on revenue model.
- [Business Model Patterns](https://reasonstreet.co/business-model-library/) - A list of 11 different ways to sell products and services.
- [Axial - Business models](https://axial.substack.com/p/axial-business-models) - 38 models for inspiration.

### Usage-based Pricing

The default, dynamic scheme for cloud resources.

- [Why I Love Usage-Based Pricing](https://www.rdegges.com/2020/the-only-type-of-api-services-ill-use/) - “The most important reason I like this pricing model is that it heavily incentivizes both the customer and the service provider to act in everyone's best interest.” Also details issues with other pricing models.
- [Socially Optimal Pricing of Cloud Computing Resources](https://webee.technion.ac.il/people/shimkin/PAPERS/Menache-CloudPricing-Conf2011.pdf) - “The socially optimal operating point is unique, and can be sustained by a linear, usage-based tariff, which charges a fixed price per unit resource and unit time.” This paper justify of usage-based pricing for cloud resources.
- “Billing is not complex on purpose: it's the price to pay for elasticity.” ([source](https://twitter.com/kdeldycke/status/1214160678363246592)) - Or why you're likely to get an endless stream of complaining users if choosing utility pricing scheme: while accurate to the (milli-)cent, this model is frustrating for customers not ready to invest time grasping the underlaying concepts.
- [Riemann sum](https://en.wikipedia.org/wiki/Riemann_sum) - The starting point about quantization of usage.
- [Allen's interval algebra](https://en.wikipedia.org/wiki/Allen%27s_interval_algebra) - Implementing usage-based pricing is tricky, and this algebra will help you organize temporal reasoning. Also see this [Stack Overflow question with clean schema](https://stackoverflow.com/questions/12069082/allens-interval-algebra-operations-in-sql?rq=1).
- [Reconcile Your Monthly GCP Invoice with BigQuery Billing Export](https://medium.com/@lukwam/reconcile-your-monthly-gcp-invoice-with-bigquery-billing-export-b36ae0c961e) - Behind the quest of this developer to track its expenses, you get a glimpse on cloud billing difficulties. While not explicitly pointed out, pricing cloud resources is hard and the result of quantization, granularity and rounding, between space, time and currencies.
- [AWS EC2 T2 Instances Demystified: Don't Learn The Hard Way](https://roberttisdale.com/aws-ec2-t2-instances-demystified-dont-learn-hard-way/) - An example of really tricky burstable instances which accrues and limits its own amount of CPU usage credits.
- [“Designing billing for a service can be really challenging”](https://news.ycombinator.com/item?id=23536919) - Personal anecdote on the design of the pricing plan for AWS Simple Email Service.


### Subscription Plans

Highly popular for SaaS businesses, subscription plans are easy to comprehend.

- [`f-license`](https://github.com/furkansenharputlu/f-license) - Open-source license key generation and verification tool in Go.

### Hybrid

Uncommon pricing schemes.

- [The Three Part Tariff](https://tomtunguz.com/three-part-tariffs/) - Beyond linear pricing, there is a place for an additional platform fee and free-tier component in the pricing structure.
- [Google Ads API: `BillingCap` enum](https://developers.google.com/ad-manager/api/reference/v201911/CompanyService.BillingCap) - Capped actuals: monthly with rollover, an optimized pricing scheme to limit surprises from customers, in which we more or less sell quotas.

### Strategy

Theory and practical insight to help you choose the right price point.

- [Pricing Psychology](https://www.nickkolenda.com/psychological-pricing-strategies/) - Which numbers should you use? How high should it be? Should it be rounded? This guide has 42 tricks to help you choose the best price.
- [The 7 factors to consider when pricing your startup product](https://tomtunguz.com/how-to-price-your-startups-product/) - Pricing is an offensive tool to reinforce your product value and underscore the company core marketing message.
- [Finding the max revenue price mark for digital products](https://medium.com/@hovm/finding-the-max-revenue-price-mark-for-digital-products-24cef24f746d) - “TL;DR: to find the optimal price that provides maximum revenue for your product you will need to field-test several price points; you then reconstruct the revenue curve and find the peak.”
- [Pricing niche products](https://kevinlynagh.com/notes/pricing-niche-products/) - “The most compelling argument against simply picking a price, though, is that it limits how much you can learn about your market.”
- [The cup-of-coffee pricing fallacy](https://blog.gingerlime.com/2020/the-cup-of-coffee-pricing-fallacy/) - Explains why it is a sloppy analogy.


## Product Catalog

The central repository of all available services, products, variants, options and pricing available to the customer to purchase.

- [GCP Product Catalog](https://cloud.google.com/blog/products/gcp/introducing-cloud-billing-catalog-api-gcp-pricing-in-real-time)


## Calculator

Simulate a virtual invoice depending on the resource you plan to use.

- [Cloud Cost Calculator](https://github.com/scalyr/cloud-costs) - Web-based tool for finding the cheapest cloud servers for a given set of requirements.
- [Cloud Computing Comparison Engine](https://www.cloudorado.com)
- [EC2Instances.info](https://ec2instances.info) - Easy Amazon EC2 Instance Comparison.


## Cost Forecast

Help your customers predict their upcoming and future consumption based on their past usage.

- [Forecasting: Principles and Practice](https://otexts.com/fpp2/) - “Comprehensive introduction to forecasting methods and to present enough information about each method for readers to be able to use them sensibly.”
- [Transforming Financial Forecasting with Data Science and Machine Learning at Uber](https://eng.uber.com/transforming-financial-forecasting-machine-learning/) - Discusses how Uber apply data science and machine learning in their financial planning platforms.
- [Time Series Prediction - A short introduction for pragmatists](https://www.liip.ch/en/blog/time-series-prediction-a-short-comparison-of-best-practices) - [Facebook's Prophet](https://facebook.github.io/prophet/) (which [uses Stan underneath](https://statmodeling.stat.columbia.edu/2017/03/01/facebooks-prophet-uses-stan/)), seems to be worth checking to implement a cost forecast tool while taking care of seasonality.
- [Komiser](https://github.com/mlabouardy/komiser) - Open-source tool to stay under budget by uncovering hidden costs, monitoring increases in spend, and making impactful changes based on custom recommendations.
- [GCP Cost Forecast](https://cloudplatform.googleblog.com/2018/07/predict-your-future-costs-with-google-cloud-billing-cost-forecast.html)
- [AWS Forecast product](https://aws.amazon.com/forecast/)
- [How to save money on your AWS bill](https://twitter.com/QuinnyPig/status/1091041507342086144).


## Marketplace

A marketplace connect supply with demand that lead to a financial transaction. If there is no payment involved, then it is an aggregator, or a hub. Not a marketplace.

- [Customized Regression Model for Airbnb Dynamic Pricing](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing) - This paper describes the pricing strategy model deployed at Airbnb.
- [Papers we love: Auctions and Bidding](https://github.com/papers-we-love/papers-we-love/tree/master/economics#auctions-and-bidding) - A collection of papers on bidding and auctions.
- [Vickrey auction](https://en.wikipedia.org/wiki/Vickrey_auction) - Hinted by an [HN comment](https://news.ycombinator.com/item?id=19145391), in which yes, “‘Asking people what they'd pay for and how much rarely works.’ (…) [but] using a Vickrey auction, similar to Google's ad auction mechanism, can elicit a person's maximum willingness-to-pay.”
- [19 Tactics to Solve the Chicken-or-Egg Problem and Grow Your Marketplace](https://www.nfx.com/post/19-marketplace-tactics-for-overcoming-the-chicken-or-egg-problem) - “Which comes first, the supply or the demand? Chicken or egg?”
- How to Kickstart and Scale a Marketplace Business: [Constrain the marketplace](https://www.lennyrachitsky.com/p/how-to-kickstart-and-scale-a-marketplace); Decide which side of the marketplace to concentrate on; Drive initial supply; Drive initial demand. A 4-parts series with dozen of interviews of people with direct experience building and scaling marketplaces.

### Cloud Resources

This sub-section focus on bid/ask mechanism matching resource producer with consumers. Most of the time these are one-sided markets with the big platform trying to amortized under-utilized inventory.

- [Incentive Engineering for Computational Resource Management](https://agoric.com/assets/pdf/papers/incentive-engineering-for-computational-resource-management.pdf) - Paper exploring the “mechanisms for the allocation of processor time and storage that are compatible both with programming practice and with market mechanisms.”
- [Pricing of Service in Clouds: Optimal Response and Strategic Interactions](http://www.sigmetrics.org/mama/2013/abstracts2013/UrgaonkarEtAl.pdf) - “How should the consumer modulate its demand to optimize its profits? (…) How should the provider and consumer negotiate the specific pricing structure they will employ?” Covers non-linear models, tiered pricing, elastic demand, consumer et provider strategies.
- [Dynamic Cloud Pricing for Revenue Maximization](https://henryhxu.github.io/share/hxu-tcc2013.pdf) - “Amazon's spot price is unlikely to be set according to market supply and demand. Rather, price oscillates within a very narrow band most of the time, which is more likely to be an artifact of some pricing algorithm with predetermined reserve price.”
- [Usage Patterns and the Economics of the Public Cloud](https://vita.mcafee.cc/PDF/EconPublicCloud.pdf) - “We examine the economics of demand and supply in cloud computing. (…) These results explain why fixed prices currently prevail despite the seeming need for time-varying dynamics. Examining the actual CPU utilization provides a lens into the future. (…) demand fluctuations would be on par with the three classic industries where dynamic pricing is important (hotels, electricity, airlines) and dynamic prices would be essential for efficiency.”
- [Maximizing Profit of Cloud Brokers under Quantized Billing Cycles: a Dynamic Pricing Strategy based on Ski-Rental Problem](https://arxiv.org/pdf/1507.02545.pdf) - “The key idea of our algorithms is to use pricing signal to regulate user demand. One may argue that such an algorithm gives poor service to the user as it pushes tasks out of the queue in order to maximize cloud broker's profit.”
- [Present or Future: Optimal Pricing for Spot Instances](https://web.archive.org/web/20150708151037/http://www.temple.edu/cis/icdcs2013/data/5000a410.pdf) - “Pricing policy of spot resources should be carefully designed and the impact on both present and future should be considered.”
- “You always pay the spot market price, not your bid.” ([source](https://news.ycombinator.com/item?id=20347716)) - Simple explanation of the bidding mechanism.
- [Deconstructing Amazon EC2 Spot Instance Pricing](http://www.cs.technion.ac.il/~dan/papers/Spotprice11CloudCom.pdf) - “Cloud providers possessing large quantities of spare capacity must either incentivize clients to purchase it or suffer losses. Amazon is the first cloud provider to address this challenge, by allowing clients to bid on spare capacity and by granting resources to bidders while their bids exceed a periodically changing spot price.”
- [GCP Preemptible VMs vs AWS Spot Instances](https://news.ycombinator.com/item?id=9564287).
- “Look at the 3-month spot price history to estimate cost and to discover combinations of availability zone and instance type with extra capacity.” ([source](https://news.ycombinator.com/item?id=16071684)) - TL;DR: users are seeking more transparency on the spot market.
- [The Eternal Cost Savings Of Netflix's Internal Spot Market](http://highscalability.com/blog/2017/12/4/the-eternal-cost-savings-of-netflixs-internal-spot-market.html) - When you're big enough that [creating an internal secondary market](https://medium.com/netflix-techblog/creating-your-own-ec2-spot-market-6dd001875f5) for instances makes economic sense.
- [AutoSpotting](https://github.com/AutoSpotting/AutoSpotting) - Tool that easily and reliably converts (all) your existing AutoScaling groups to cheaper spot instances.

### Online Ads

Targeted online advertisements marketplaces have a lot in common with traditional cloud marketplace. Some good inspiration there, from concepts to tech

- [RTB Budget Pacing Summarized](https://github.com/PragmaticLab/RTB_Budget_Pacing_Summarized) - A collection of budget pacing resources for targeted online advertisements.
- [Samsung's online ads platform/exchange war story](https://github.com/eloraiby/fs-pacer/blob/master/fs-pacer.md) - How to scale to 5M bid request/s, 2ms Max Response Time.
- [`RTB4Free`](https://github.com/RTB4FREE) - Open Source Bidder and Demand Side Platform (DSP).


## Accounting

### Double-Entry Model

The core concept of accounting is double-entry. It is the most critical part to grasp in order to properly design any robust system that tracks money.

- [Accounting for Developers 101](https://docs.google.com/document/d/1HDLRa6vKpclO1JtxbGB5NeAYWf8cf1UMGy22o8OZZq4) - A general introduction to history and vocabulary of accounting.
- [Accounting for Computer Scientists](https://martin.kleppmann.com/2011/03/07/accounting-for-computer-scientists.html) - Describes how to view accounting in the form of graphs in which money flows, then how these movements are materialized in the financial statements of a small company.
- [The Double-Entry Counting Method](https://beancount.github.io/docs/the_double_entry_counting_method.html) - Same premise as above, but way more detailed and complete, as it adds reporting and implementation details.
- [Accounting Memento For Entrepreneurs (US GAAP)](https://www.odoo.com/documentation/functional/accounting.html) - An interactive form to play with accounting concepts.

### Bookkeeping

Everything you need to know about the daily practice of keeping your accounting data clean and tidy.

- [So, you want to learn Bookkeeping!](http://www.dwmbeancounter.com/tutorial/Tutorial.html) - Focus on the daily operations of recording and maintaining the transactions of a business.
- [Plain text accounting tools](https://plaintextaccounting.org/#software) - Extensive list of open-source personal finance projects that might be great to look into for inspiration on double-entry accounting and bookkeeping.
- And a list of graphical accounting tools: [GNUCash](https://gnucash.org) (GTK+), [Grisbi](https://grisbi.org) (C), [Firefly III](https://firefly-iii.org) (PHP).
- [GnuCash Tutorial and Concepts Guide](https://www.gnucash.org/docs/v2.4/C/gnucash-guide/) - A complete tutorial on personal finance tracking with GnuCash.
- [Frappe Books](https://github.com/frappe/books) - Free Desktop book-keeping software for small-businesses and freelancers.
- [Luca](https://github.com/brandon-rhodes/luca) - YAML accounting and JSON tax forms.

### Software design and implementation

Now that you're somewhat familiar with the concepts and practive of accounting, here are some resources to help you implement that knowledge into software systems.

- [Moonpig: a billing system that doesn't suck](https://blog.plover.com/prog/Moonpig.html) - Design decisions behind a billing and accounting system. Key takeaway: some companies still pays by checks; do not use floats; complex customer workflows; date and time issues; mutable data.
- [Books, an immutable double-entry accounting database service](https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/) - Explain the basic data model of a double-entry accounting system relying on Google Spanner for internal use at Square.
- [Django Hordak](https://django-hordak.readthedocs.io) - Core functionality of a double entry accounting system for Django.
- [Managed accounts for Django](https://github.com/django-oscar/django-oscar-accounts) - A 'managed account' is an allocation of money that can be debited and credited.
- [Triple‐entry accounting with blockchain: How far have we come?](https://onlinelibrary.wiley.com/doi/abs/10.1111/acfi.12556) - “Triple‐entry accounting is a new and a more efficient way to address fundamental trust and transparency issues that plague current accounting systems. Triple‐entry accounting with blockchain, when properly implemented, can fundamentally improve accounting.”

### Analytics

Once you've got your accounts in order, you can start extracting insights and metrics your financial data.

- [Accounts Demystified: The Astonishingly Simple Guide To Accounting](https://www.amazon.co.uk/Accounts-Demystified-Astonishingly-Simple-Accounting/dp/0273744704/) - Helps you learn how to analyse and monitor your company's financial performance.
- [Financial Intelligence for Entrepreneurs: What You Really Need to Know About the Numbers](https://www.amazon.com/Financial-Intelligence-Entrepreneurs-Really-Numbers/dp/1422119157) - Allows you to fully understand how to use financial data to make better decisions for your business.
- [Algebraic Models for Accounting Systems](https://www.amazon.com/Algebraic-Models-For-Accounting-Systems/dp/9814287113) - Advanced abstract algebra applied to the analysis of accounting systems.

### Currencies

Global companies needs to know how to juggle between local currencies.

- [Tutorial on multiple currency accounting](https://www.mathstat.dal.ca/~selinger/accounting/tutorial.html) - An excellent resource for implementing multi-currency accounting systems.


## Coupons and Vouchers

- [Quantity discounts on a virtual good: The results of a massive pricing experiment](https://www.pnas.org/content/pnas/113/27/7323.full.pdf) - “Implementing price reductions ranging from 9–70% for large purchases, we found re- markably little impact on revenue, either positively or negatively.”
- [Raising Prices is Hard](https://www.backblaze.com/blog/raising-prices-is-hard/) - Backblaze post-mortem on raising prices on their main offer. They wanted to create an extension program based on credit system. This became a full-time job for a handful of their most senior engineers, and resulted in a six month project.
- [Details on Expiring DigitalOcean Credits](https://blog.digitalocean.com/details-on-expiring-digitalocean-credits/) - The reason you have to add an time limit on credits: unused ones accounts as liabilities on our balance sheet.
- [Hacking Scooters: How I Created $100k Worth Of Free Rides](https://webcache.googleusercontent.com/search?q=cache:7hrzYYk5-IwJ:https://fant.io/p/hacking-voi/) - A cautionary tale on how promo codes can be exploited to get unlimited free rides.
- [China's Pinduoduo reports theft of online discount vouchers to police](https://www.reuters.com/article/us-pinduoduo-china/chinas-pinduoduo-reports-theft-of-online-discount-vouchers-to-police-idUSKCN1PE05J) - The next level of fraud: “an online collective exploited a loophole on its platform to ‘steal’ tens of millions of yuan worth of discount vouchers”.
- [Council Directive 2016/1065 as regards the treatment of vouchers](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016L1065) - European directive on the application of VAT when vouchers are involved.


## Taxes

- [Council Directive 2006/112/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L:2006:347:FULL) - European Union reference on the common system of VAT.
- [2017 Tax Software Developer's Guides](https://www.mass.gov/lists/2017-tax-software-developers-guides) - A list of test cases for developers to test their tax code against.
- [{Digital,Cloud,Electronic,Online} Services VAT Rate Database](https://github.com/kdeldycke/vat-rates) - Centralize applicable VAT rates on foreign online services, for each country of residence (including territorial exceptions).
- [Global VAT & GST on digital services](https://www.avalara.com/vatlive/en/global-vat-gst-on-e-services.html) – List of countries requiring application of taxes on foreign provided online services.
- [What does the "Reverse Charge" refer to?](https://news.ycombinator.com/item?id=8767388) - Answer: a provision in which a business transfer the responsibility of VAT handling to the customer.
- “British supermarkets (…) charge you a fee for their backend card processing, but they subtract that fee from your checkout price.” ([source](https://news.ycombinator.com/item?id=22047028)) -  Which allows them to [claim the VAT on processing fees as input tax](https://www.gov.uk/guidance/vat-guide-notice-700#section4).


## Invoice

The invoice materialize a consumed service or purchased product, waiting to be settled by a payment transaction.

- [On GCP invoiced billing](https://news.ycombinator.com/item?id=17517479) - [Invoiced billing](https://cloud.google.com/billing/docs/how-to/invoiced-billing) (B2B-friendly payment by the customer after the service is consumed and an invoice issued) is a pain on GCP.
- [Digital signatures: how Sleek leverages Cloud HSM to guarantee the integrity of legal documents](https://medium.com/google-developers/digital-signatures-how-sleek-leverages-cloud-hsm-to-guarantee-the-integrity-of-legal-documents-a7bd3b82faf6) - Here is a great way to rely on GCP's HSM to digitally sign documents and provide an immutable audit-trail. Might be applied to invoices as well as contract agreements.
- [OpenTimestamps](https://opentimestamps.org) - Go beyond the solution above, and timestamp immutable document directly on Bitcoin's blockchain.
- [Manta](https://github.com/hql287/Manta) - Flexible invoicing desktop app with beautiful & customizable templates.
- [InvoicePlane](https://github.com/InvoicePlane/InvoicePlane) - A self-hosted open-source application for managing your invoices, clients and payments.
- [InvoiceGenerator](https://github.com/by-cx/InvoiceGenerator) - Library to generate a simple invoices.
- [Ruby Invoicing Framework](https://github.com/code-mancers/invoicing) - For generating and displaying invoices (ideal for commercial Rails apps). It allows for flexible business logic; provides tools for tax handling, commission calculation etc.
- [Refact](http://en.userstudio.fr/projects/refact/) - A design project trying to revamp a phone bill with infographics.
- [InvoiceNet](https://github.com/naiveHobo/InvoiceNet) - Deep neural network to extract intelligent information from invoice documents.


## Payments

- [The Best Payment Gateway for Startups](http://aynuriev.com/best-payment-gateway-startups/) - A benchmark of top payment providers, their pricing and models.
- [Avoiding Double Payments in a Distributed Payments System](https://medium.com/airbnb-engineering/avoiding-double-payments-in-a-distributed-payments-system-2981f6b070bb) - RDBMS were build for banks around transactions to solve that specific issue. Then NoSQL came forcing us to carefully implement systems to avoid double spending.
- [Monzo's bank transfers post-mortem](https://monzo.com/blog/2019/06/20/why-bank-transfers-failed-on-30th-may-2019/) - Or why you should be prepared for and work around gateway provider's outages.
- [How to Build an Insurance Company](https://www.moderntreasury.com/journal/how-to-build-an-insurance-company) - The importance of payment ops architecture.
- [EU's Late Payment Directive](https://ec.europa.eu/growth/smes/support/late-payment_en) - European rules on applicable fees for late payments.
- [High failure rate of Point Of Sale devices in the upper Midwest](https://news.ycombinator.com/item?id=20043944) - The root cause? People wearing a lot of wool in low humidity air, generating a lot of static.
- How ACH works: A developer perspective, [part 1](https://engineering.gusto.com/how-ach-works-a-developer-perspective-part-1/), [part 2](https://engineering.gusto.com/how-ach-works-a-developer-perspective-part-2/), [part 3](https://engineering.gusto.com/how-ach-works-a-developer-perspective-part-3/), [part 4](https://engineering.gusto.com/how-ach-works-a-developer-perspective-part-4/).
- [Handling system failures during payment communication](https://blogs.dropbox.com/tech/2017/09/handling-system-failures-during-payment-communication/) - Dropbox's experience trying to account for an unreliable payment provider.
- [Why was I charged?](https://wpchrg.wordpress.com) - Under a constant stream of user complaints about payments, WordPress created a dedicated subdomains to help customers understand unexpected transactions. The trick is to add the URL of that kind of site directly in the bank statement.

### Receipt

A receipt materialize the payment transaction.

- [The humble receipt gets a brilliant redesign](https://www.fastcompany.com/90347782/the-humble-receipt-gets-a-brilliant-redesign) - When a Netflix data engineer revisit receipts.
- [The long, long history of long, long CVS receipts](https://www.vox.com/the-goods/2018/10/10/17956950/why-are-cvs-pharmacy-receipts-so-long)

### Credit Cards

The most popular payment device.

- ['Is that even legal?': Companies may be sharing new credit or debit card information without you knowing](https://www.cbc.ca/news/business/banking-information-shared-with-third-parties-1.5102931) - Some credit and debit card companies have "updating service" that allows new account numbers and expiry dates to be shared with merchants. Visa's implementation is called [VAU](https://developer.visa.com/capabilities/vau) and Mastercard's is [ABU](https://developer.mastercard.com/product/automatic-billing-updater).
- [Strong Customer Authentication](https://stripe.com/guides/strong-customer-authentication) - [Payment Services Directive](https://en.wikipedia.org/wiki/Payment_Services_Directive) 2, explained.
- [Address Verification System](https://en.wikipedia.org/wiki/Address_Verification_System) - A system checking the matching of customer's billing addresses with the one associated with the credit card.
- [pci-blackbox](https://github.com/trustly/pci-blackbox) - PCI-DSS compliant card system built on PostgreSQL and PL/pgSQL.

### Bank Accounts

The old-fashioned way of payment: by the way of banks.

- [Open IBAN](https://openiban.com) - Free and public IBAN validation and calculation webservice.
- [Swift Codes](https://bank.codes/swift-code/) - Swift / BIC vodes for personal use only.
- [Swift Codes Repository](https://github.com/PeterNotenboom/SwiftCodes) - A repository that seems to scrape the website above.

### Online Payments

The usual money transfer services.

- [The untold story of Stripe](https://www.wired.co.uk/article/stripe-payments-apple-amazon-facebook) - In which we learn that “once turnover hit a certain level, Paypal automatically put the business on a 21 to 60 day rolling reserve, meaning that up to 30 per cent of a company's revenue could be locked up for up to two months.”


## Fraud

There's monetary incentives to exploit your business. Be prepared to fight hordes of fraudsters and shady users.

- [Detecting fraudulent activity in a cloud using privacy-friendly data aggregates](https://arxiv.org/pdf/1411.6721v1.pdf) - Discusses a method to detect fraudulent activity (launching DDoS attacks, Bitcoin mining, …) by using non-intrusive, privacy-friendly data: billing data.
- [Awesome List of IAM: Fraud links](https://github.com/kdeldycke/awesome-iam#fraud) - Section dedicated to fraud management related to user accounts, from our sister repository.
- [Driving Global Fraud Losses Down While Empowering Business Growth](https://youtu.be/yJKWpTBVTiI?t=60) - In this talk by Uber Eats, we learn from the biggest payment processor that “growing businesses with declining loss rates is extremely rare in the industry”. Also, fraud can takes several forms: chargebacks on non-perishable goods, promo abuse, refunds…

### Cards

The majority of fraud is exploiting the most common popular payment device: credit cards.

- [How I Stopped a Credit Card Thief From Ripping Off 3,537 People – and Saved Our Nonprofit in the Process](https://www.freecodecamp.org/news/stopping-credit-card-fraud-and-saving-our-nonprofit/) - Describe a fraud technique known as  "card testing", in which massive batch of stolen cards are checked for their validity against your API.
- [How Candy Japan got credit card fraud somewhat under control](https://www.candyjapan.com/behind-the-scenes/how-i-got-credit-card-fraud-somewhat-under-control) - Suggestions involved either [warning signals](https://www.candyjapan.com/behind-the-scenes/fraudulent-transaction-warning-signs) for trying to guess which orders might be fraud, or countermeasures to try to make things harder for the fraudsters.
- [Five Fun Fraud Facts](https://blog.sift.com/2013/five-ecommerce-fraud-facts/) - Another tiny collection of features we can feed to a ML system to detect fraud. Comments on HN also unearthed [more qualifying signals](https://news.ycombinator.com/item?id=6376350) and [derived geodata on the transaction](https://news.ycombinator.com/item?id=6376221).
- [Credit Card Fraud Detection using Autoencoders in Keras](https://medium.com/@curiousily/credit-card-fraud-detection-using-autoencoders-in-keras-tensorflow-for-hackers-part-vii-20e0c85301bd) - Tutorial on how to rely on anomaly detection to implement suspicious card transactions.
- [How credit card thieves use free-to-play apps to launder gains](https://kromtech.com/blog/security-center/digital-laundry) -  To prevent abuses, service provider must strengthen both credit card verification and the account creation process.

### Trust Score

Synthetic score based on a collection of signals are often the best proxy of user's trustworthiness. Customer support most of the time rely on them to take action when these actions are not triggered automatically.

- [The Secret Trust Scores Companies Use to Judge Us All](https://www.wsj.com/articles/the-secret-trust-scores-companies-use-to-judge-us-all-11554523206) - Nearly everything we buy, how we buy, and where we're buying from is secretly fed into AI-powered verification services that help companies guard against credit-card and other forms of fraud.
- [GCP improved account management policies to better support customers](https://cloudplatform.googleblog.com/2018/07/improving-our-account-management-policies-to-better-support-customers.html) - Or why relying too much on fraud automation might lead to disgruntled users.
- [Digital Ocean's Update on Customer Shutdown Incident](https://blog.digitalocean.com/an-update-on-last-weeks-customer-shutdown-incident/) - Aggressively shutting down user servers is good from a business point of view to prevent fraudster abusing free resources, until it's not.

### Statistics

Best tools to automate fraud detection.

- [Benford's law](https://en.wikipedia.org/wiki/Benford's_law) - Digit distribution can be a signal of accounting fraud.
- [Integer percentages as electoral falsification fingerprints](https://arxiv.org/pdf/1410.6059.pdf) - In the same spirit as above, this paper show that frequency of reported round numbers in election is a signal of man-made anomalies. Might be applicable in some fraud-fighting area.
- [Huber loss](https://en.wikipedia.org/wiki/Huber_loss) - “A loss function used in robust regression, that is less sensitive to outliers in data than the squared error loss.”
- [Peak Detection in the Python World](https://blog.ytotech.com/2015/11/01/findpeaks-in-python/) - Simple way to detect outliers.

### Billing

- [More than 600 million users installed Android 'fleeceware' apps from the Play Store](https://www.zdnet.com/article/more-than-600-million-users-installed-android-fleeceware-apps-from-the-play-store/) - A new kind of fraud, in which apps silently keep charging users after the end of the trial period.
- [CEO Fraud](https://www.knowbe4.com/ceo-fraud) - A billing team responsible for collecting payment is prey to this kind of fraud, in which the CEO is impersonated to commend exceptional payment transactions.
- [The Challenges of Operating a Computing Cloud and Charging for its Use](https://web.stanford.edu/class/cs349d/docs/theimer.pdf) - Skip the first 90% of this presentation by an AWS VP (which is about general system reliability). The last four slides are a good summary of what billing cloud services entails, especially the use of soft quotas to limit fraud.
- [Fraud in Telephony Networks](http://www.s3.eurecom.fr/docs/eurosp17_sahin.pdf) - Most of telephony frauds gravitates around billing and the metering of micro-transactions. This paper feature a taxonomy (on page 6) differentiating the root causes, vulnerabilities, exploitation techniques, and the way fraudsters can benefits from them.


## UX/UI

Users gets easily angry when it comes to money. UX and UI might helps a lot to reduce frustration.

- [Apple Subscriptions HIG](https://developer.apple.com/design/human-interface-guidelines/subscriptions/overview/) - Guide and recommendation on how to make [auto-renewable subscriptions](https://developer.apple.com/app-store/subscriptions/) user-friendly.
- [Which has a higher conversion rate: A single long ecommerce checkout form or a multi-step one?](https://capitalandgrowth.org/questions/2055/which-has-a-higher-conversion-rate-a-single-long-e.html) - Focus first on other things in the cart, like easing anxiety and second-guessing by adding reassurance (trust marks, testimonials) near the credit card and completion steps, as well as some guarantee language that you may have used earlier in the product exploration process.


## Business Intelligence

As stakeholder of the billing pipeline, you sat on all the critical data to measure and report on the health of the business.

### Metrics

Definition and collection of Key Performance Indicators (KPIs) worth monitoring.

- [Startup financial models - 12 templates compared for SaaS](https://www.stephnass.com/blog/startup-financial-model) - A great source of inspiration to get better visibility in your operations.
- [16 Startup Metrics](https://a16z.com/2015/08/21/16-metrics/) - The 2 critical metrics being Customer Acquisition Cost (CAC) and Customer Lifetime Value (CLV).
- [You're all calculating churn rates wrong](https://medium.com/swlh/youre-all-calculating-churn-rates-wrong-cbab072cd992) - Churn rate is not a meaningful metric, as during the customer lifetime the churn probability is not constant. Most of the time because of your free trial and vouchers.
- [Analyzing Churn Rates, Free Trials, and Other Metrics](https://jlongster.com/analyizing-profit-metrics) - “I didn't know anything about how to determine pricing or structure plans. My background is software development — finding insights in the mixture of churn rates, free trials, and all these other metrics seemed like magic.”
- [Churn Prediction](https://towardsdatascience.com/churn-prediction-3a4a36c2129a) - “How to use Python in a simplistic way to fuel your company's growth by applying the predictive approach to all your actions.”
- [RFM (customer value)](https://en.wikipedia.org/wiki/RFM_%28customer_value%29) - A way to segment users based on Recency, Frequency and Monetary value.
- [A Quantitative Approach to Product Market Fit](https://tribecap.co/a-quantitative-approach-to-product-market-fit/) - Metrics produced above have a greater reach, as they're used as important signals to validate product-market fit.
- [Startup growth calculator](http://growth.tlb.org) - Simple yet effective profitability calculator for startups.
- [An Overview of Visa](http://minesafetydisclosures.com/blog/2019/7/23/part-ll-an-overview-of-visa) - Great breakdown of Visa business models and metrics.

### Data Engineering

To industrialize data production and consumption, your need data engineers to clean up, persist and consolidate data. Only after you get these data foundation you might think of onboarding data scientists.

- [AI vs Data Science vs Data Engineering](https://blog.insightdatascience.com/how-emerging-ai-roles-fit-in-the-data-landscape-d4cd922c389b) - “Data Engineers build data pipelines and infrastructure to ensure a constant availability of transformed data. Data Scientists analyze and build models from these data to develop new product features or drive the bottom line of the business.” As for AI professionals, their focus is on cognitive automation.
- [Ten Ways Your Data Project is Going to Fail](https://www.martingoodson.com/ten-ways-your-data-project-is-going-to-fail/) - You don't need data scientists. “For ETL, hire data engineers. For reporting, hire BI analysts. The end.”
- [Cargo cult data science](http://blog.richardweiss.org/2017/07/25/data-science-in-organizations.html) - “Data science is best viewed as a form of company culture, rather than a set of technologies. However, many firms will try to create that company culture by acquiring data-science technology, rather than working on their culture.”
- [Why not use Double or Float to represent currency?](https://stackoverflow.com/questions/3730019/why-not-use-double-or-float-to-represent-currency/3730040#3730040) - Because of precision: floats and doubles cannot accurately represent the base 10 multiples that we use for money.
- [Never Use Floats for Money](https://husobee.github.io/money/float/2016/09/23/never-use-floats-for-currency.html) - “This is precisely the problem we have when trying to represent 10^-1, or 0.1 in binary. There is not an exact binary representation of 0.1 or 0.01.”
- [European Spreadsheet Risks Interest Group - Horror Stories](http://www.eusprig.org/horror-stories.htm) - A collection of cases in which uncontrolled and untested spreadsheet models led to lost revenue, mispricing, poor decision making, fraud and systemic financial failure.

### Tools

Software to build visualizations, dashboards, SQL queries and drill down into data.

- [Practical Business Python](https://pbpython.com) - A blog collecting and spreading ideas on how to use Python more effectively in the business setting.
- [`redash`](https://github.com/getredash/redash) - Connect and query your data sources, build dashboards to visualize data and share them with your company.
- [Metabase](https://github.com/metabase/metabase) - Metabase is an open source solution to explore and visualize data and supports lots of databases.
- [Apache Superset](https://github.com/apache/incubator-superset) - Enterprise-ready business intelligence web application.
- [Meltano](https://gitlab.com/meltano/meltano) - Open source convention-over-configuration product for the whole data lifecycle, all the way from loading data to analyzing it.
- [`insights`](https://github.com/mariusandra/insights) - Insights is a tool to visually explore a PostgreSQL database, with an emphasis on generating graphs that show business performance over time.
- [`falcon`](https://github.com/plotly/falcon) - Free, open-source SQL client for Windows and Mac with builtin graphs.


## Competitive Analysis

A bunch of resources to keep track of the current status and progress of all companies operating in the domain.

- [AWS Cost Management announcements](https://aws.amazon.com/about-aws/whats-new/aws-cost-management/).
- [AWS reserved instances vs saving plan](https://www.prosperops.com/assets/img/blog/ris_and_savings_plans.png).
- [EC2 Spot Price Tracker](https://github.com/grosskur/ec2price) - Web app that collects and graphs EC2 Spot Prices.
- [GCP billing release notes](https://cloud.google.com/billing/docs/release-notes).
- [GCP billing news](https://www.gcpweekly.com/gcp-resources/tag/billing/) - From the unofficial Google Cloud Platform newsletter.
- [More choice, less complexity: New Compute Engine pricing options on tap](https://cloud.google.com/blog/products/compute/more-choice-less-complexity-new-compute-engine-pricing-options-on-tap) - A wrap-up of recent GCP pricing features.
- [DigitalOcean Platform changelog](https://www.digitalocean.com/docs/platform/release-notes/).


## Commercial Solutions

- [Orbitera](https://www.orbitera.com) - GCP's billing subsidiary.
- [16 Online Subscription Billing Tools](https://www.analyzo.com/search/online-subscription-billing-tools/106) - An up-to-date list of subscription and recurring billing services.
- [OpenCell](https://opencellsoft.com) - Monetization platform originating from an open-source telco billing project.
- [Laravel Spark](https://spark.laravel.com) - Package that provides scaffolding for all of the stuff you don't want to code: subscription and team billing, invoices, but also user accounts features.
- [Bullet Train](https://bullettrain.co) - Same as above, but for Ruby on Rails.
- [ASP.NET Zero](https://aspnetzero.com) - Multi-tenancy, authentication and authorization, invoices and payments.
- [Chargebee](https://www.chargebee.com) - Subscription billing & revenue operations.
- [Armatic Billing & Invoicing Software](https://www.armatic.com/billing) - Invoices, accounts receivable.
- [Sensus Billing Access Application](https://sensus.com/products/billing-access/) - Billing and metering solutions for utility companies.
- [Quaderno](https://quaderno.io) - Calculate sales tax, VAT, and GST; automate receipts.
- [keygen](https://keygen.sh) - Sell and manage license keys.


## History

- [The vanished grandeur of accounting](https://www.bostonglobe.com/ideas/2014/06/07/the-vanished-grandeur-accounting/3zcbRBoPDNIryWyNYNMvbO/story.html) -
Accounting paintings were a significant genre in Dutch art.
- [Engineering and Operations in the Bell System](http://bitsavers.trailing-edge.com/communications/westernElectric/books/Engineering_and_Operations_in_the_Bell_System_2ed_1984.pdf) - Starting at page #445, the "10.5 Billing Equipment and Systems" section describe the history and technical evolutions of Bell's phone calls metering and pricing.


## Contributing

Your contributions are always welcome! Please take a look at the
[contribution guidelines](./.github/contributing.md) first.


## License

[![CC0](https://mirrors.creativecommons.org/presskit/buttons/80x15/svg/cc-zero.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
Content of this repository is licensed under the [Creative Commons CC0 license](https://creativecommons.org/publicdomain/zero/1.0/).
To the extent possible under law, [Kevin Deldycke](https://kevin.deldycke.com)
has waived all copyright and related or neighboring rights to this work.
