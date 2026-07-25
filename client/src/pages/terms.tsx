import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";

const sections = [
  {
    title: "who we are",
    body: (
      <>
        <p>
          sarahdigs is a creative website studio that designs and builds high-performing
          websites for businesses. by engaging with us, whether through a paid
          project, consultation, or any other service, you agree to the terms
          outlined in this document.
        </p>
        <p>
          these terms apply to all services offered by sarahdigs, including the
          full dig, dig-in consultation, custom dig, and any retainer
          arrangement.
        </p>
        <p>
          one thing up front: we write these in plain language because we think
          that's more respectful than pages of legal text designed to protect
          us from you. we'd rather both sides understand what's expected.
        </p>
      </>
    ),
  },
  {
    title: "our services",
    body: (
      <>
        <p>sarahdigs offers the following core services:</p>
        <ul>
          <li>
            <span className="text-[#181612] font-medium">the full dig</span>:
            a comprehensive website build including strategy, design,
            development, and optimization. delivered in defined tiers (the dig,
            the deep dig, the full dig) scoped and agreed before work begins.
          </li>
          <li>
            <span className="text-[#181612] font-medium">dig-in consultation</span>:
            a focused diagnostic call and written action plan. a one-time
            deliverable with no ongoing obligation on either side unless
            explicitly agreed.
          </li>
          <li>
            <span className="text-[#181612] font-medium">custom dig</span>:
            a custom engagement built around a specific situation. scope and
            deliverables are agreed in writing before any work starts.
          </li>
          <li>
            <span className="text-[#181612] font-medium">retainer arrangements</span>:
            ongoing work agreed on a monthly basis. terms, scope, and output
            are defined in a separate retainer agreement.
          </li>
        </ul>
        <p>
          the specific scope of work for any engagement is defined in a written
          proposal or statement of work (SOW). if there is any conflict between
          these general terms and a signed proposal, the proposal governs.
        </p>
      </>
    ),
  },
  {
    title: "how engagements work",
    body: (
      <>
        <p>
          <span className="text-[#181612] font-medium">starting work</span>
        </p>
        <p>
          work begins when both parties have agreed on scope in writing and the
          agreed deposit has been received. we do not start work speculatively
          or on a handshake.
        </p>
        <p>
          <span className="text-[#181612] font-medium">project timelines</span>
        </p>
        <p>
          timelines are estimated at the start of each engagement and agreed in
          writing. delays caused by late feedback, missing materials, or scope
          changes may impact delivery dates. we'll always communicate clearly
          if a timeline shifts.
        </p>
        <p>
          <span className="text-[#181612] font-medium">feedback and revisions</span>
        </p>
        <p>
          each project includes a defined number of revision rounds per
          deliverable, specified in the proposal. revisions beyond the agreed
          scope may be billed at our standard hourly rate or may require a
          scope amendment. we will always confirm with you before incurring
          additional charges.
        </p>
        <p>
          <span className="text-[#181612] font-medium">your input</span>
        </p>
        <p>
          project quality depends on what you bring: clear goals, timely
          feedback, accurate business information, and responsive
          communication. we do the digging, but we need you to show up too.
        </p>
      </>
    ),
  },
  {
    title: "payments",
    body: (
      <>
        <p>
          <span className="text-[#181612] font-medium">deposit</span>
        </p>
        <p>
          all projects begin with a deposit, typically 50% of the total project
          fee unless otherwise specified in the proposal. this secures your
          spot and confirms mutual commitment.
        </p>
        <p>
          <span className="text-[#181612] font-medium">milestone payments</span>
        </p>
        <p>
          for larger projects, remaining fees are split across defined
          milestones agreed in writing. final payment is due before final files
          and live access are transferred.
        </p>
        <p>
          <span className="text-[#181612] font-medium">retainers</span>
        </p>
        <p>
          retainer fees are invoiced monthly, in advance. retainers are
          month-to-month unless otherwise agreed in writing.
        </p>
        <p>
          <span className="text-[#181612] font-medium">late payments</span>
        </p>
        <p>
          invoices are due within 14 days of issue unless otherwise agreed.
          overdue invoices may result in a pause of work until the account is
          settled. we don't charge late fees by default, but we do stop work,
          and that affects your timeline.
        </p>
        <p>
          <span className="text-[#181612] font-medium">refunds</span>
        </p>
        <p>
          deposits are non-refundable once work has begun. if you cancel before
          work starts, we'll discuss a fair resolution. if we fail to deliver
          what was agreed, we'll make it right, through revision, credit, or
          partial refund depending on the situation.
        </p>
      </>
    ),
  },
  {
    title: "intellectual property",
    body: (
      <>
        <p>
          <span className="text-[#181612] font-medium">what you own after final payment</span>
        </p>
        <p>
          once a project is paid in full, you own the final deliverables: the
          design files, the built website, the copy produced for you, and any
          other agreed outputs. full ownership transfers to you.
        </p>
        <p>
          <span className="text-[#181612] font-medium">what we retain</span>
        </p>
        <p>
          we retain the right to show the completed work in our portfolio, case
          studies, and general marketing, unless you've asked for
          confidentiality in writing and we've agreed to it.
        </p>
        <p>
          we also retain ownership of any proprietary frameworks, templates, or
          tooling we bring to a project. these may be used in your deliverable
          but aren't transferred as part of project ownership.
        </p>
        <p>
          <span className="text-[#181612] font-medium">your assets</span>
        </p>
        <p>
          any materials you provide, logos, images, copy, brand assets,
          third-party content, remain yours. you are responsible for ensuring
          you have the right to use them.
        </p>
        <p>
          <span className="text-[#181612] font-medium">third-party tools and licenses</span>
        </p>
        <p>
          if your website is built on a platform, CMS, or tool that requires
          its own license or subscription (e.g. Webflow), that relationship is
          between you and the platform. we'll always flag this clearly before
          building on any third-party infrastructure.
        </p>
      </>
    ),
  },
  {
    title: "your responsibilities",
    body: (
      <>
        <p>for us to do our best work, you agree to:</p>
        <ul>
          <li>provide accurate, complete information about your business when requested</li>
          <li>respond to feedback requests within the timeframes agreed (typically 5 business days unless otherwise specified)</li>
          <li>ensure that any content, assets, or materials you provide don't infringe on third-party rights</li>
          <li>designate a clear decision-maker on your side, projects with unclear internal ownership create delays and confusion</li>
          <li>make timely payments per the agreed schedule</li>
        </ul>
        <p>
          prolonged delays caused by your side may result in the project being
          rescheduled or a restart fee being applied. we'll always communicate
          before taking that step.
        </p>
      </>
    ),
  },
  {
    title: "confidentiality",
    body: (
      <>
        <p>
          we treat your business information, strategy, positioning, audience
          insights, financials, internal documents, as confidential. we don't
          share it with other clients, discuss it publicly, or use it to inform
          work done for anyone else.
        </p>
        <p>
          if your engagement requires a formal NDA, we can sign one. if you
          need a specific clause around sensitive information, raise it before
          work begins.
        </p>
        <p>
          by the same token: any frameworks, processes, or proprietary methods
          we share with you as part of the engagement are ours. you're welcome
          to use what we build together for your business, but not to resell or
          redistribute our methodology.
        </p>
      </>
    ),
  },
  {
    title: "limitation of liability",
    body: (
      <>
        <p>we do quality work and stand behind it. but a few honest limits:</p>
        <ul>
          <li>
            <span className="text-[#181612] font-medium">results</span>: we
            can build a website that is strategically sound, well-designed, and
            optimized for search and conversion. we cannot guarantee specific
            revenue outcomes, traffic numbers, or ranking positions. those
            depend on factors beyond our control (your market, competition, how
            you follow up with leads, etc).
          </li>
          <li>
            <span className="text-[#181612] font-medium">third-party platforms</span>:
            if a platform we build on (Webflow, Google Search, etc.) changes
            its behavior, we are not liable for resulting impact. we'll advise
            on how to adapt.
          </li>
          <li>
            <span className="text-[#181612] font-medium">our liability cap</span>:
            in any dispute, our maximum liability is limited to the total
            fees paid by you for the specific engagement in question.
          </li>
        </ul>
        <p>
          we are not liable for indirect, consequential, or incidental damages,
          including lost revenue, lost data, or lost opportunities, arising
          from work we deliver or fail to deliver.
        </p>
      </>
    ),
  },
  {
    title: "termination",
    body: (
      <>
        <p>
          <span className="text-[#181612] font-medium">by you</span>
        </p>
        <p>
          you may terminate an engagement at any time in writing. work
          completed to that point will be invoiced and due. the deposit is
          non-refundable. any files or deliverables completed and paid for are
          yours.
        </p>
        <p>
          <span className="text-[#181612] font-medium">by us</span>
        </p>
        <p>
          we reserve the right to terminate an engagement if: you repeatedly
          miss agreed-upon timelines or feedback windows; payment is
          significantly overdue; the scope shifts substantially from what was
          agreed without a corresponding scope amendment; or the working
          relationship becomes unworkable in good faith.
        </p>
        <p>
          if we terminate, we'll deliver whatever has been completed and paid
          for. we don't leave people with nothing.
        </p>
        <p>
          <span className="text-[#181612] font-medium">retainers</span>
        </p>
        <p>
          either party may cancel a retainer with 30 days written notice. the
          final month runs out fully and is not prorated unless both parties
          agree otherwise.
        </p>
      </>
    ),
  },
  {
    title: "changes to these terms",
    body: (
      <>
        <p>
          we may update these terms from time to time. when we do, the date at
          the bottom of this page is updated. if changes are significant, we'll
          notify active clients by email.
        </p>
        <p>
          continuing to work with us after a change constitutes acceptance of
          the updated terms. if you have concerns about a specific change,
          raise them with us directly.
        </p>
        <p>
          terms in force at the time of a signed proposal govern that specific
          engagement, even if terms change later.
        </p>
      </>
    ),
  },
  {
    title: "contact",
    body: (
      <>
        <p>
          questions, concerns, or anything that doesn't fit neatly into a
          policy, we'd rather hear from you directly than have you wonder.
        </p>
        <p>
          <span className="text-[#181612] font-medium">sarahdigs</span>
          <br />
          for questions about these terms:{" "}
          <a
            href="mailto:sarah@sarahdigs.com"
            className="text-[#6B1421] underline underline-offset-4 decoration-[#6B1421]/40 hover:decoration-[#6B1421] transition-colors"
          >
            sarah@sarahdigs.com
          </a>
        </p>
        <p>we aim to respond within 2 business days.</p>
      </>
    ),
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#181612] font-sans selection:bg-[#6B1421] selection:text-[#F4F1EA]">
      <SEO
        title="terms"
        description="The terms under which sarahdigs delivers websites, consultations, and ongoing work."
        canonical="/terms"
        noindex
      />
      <Navbar theme="light" />

      <main className="pt-[180px] pb-32">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="max-w-3xl mb-20 md:mb-28">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B1421] mb-5 block">
              policy
            </span>
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1] tracking-tight text-[#181612] mb-6 lowercase">
              terms of service.
            </h1>
            <p className="text-lg md:text-xl text-ink-mid leading-relaxed lowercase">
              the terms under which sarahdigs delivers websites, consultations,
              and ongoing work, in plain language.
            </p>
          </div>

          {/* Sections */}
          <div className="max-w-3xl space-y-20 md:space-y-24">
            {sections.map((section, i) => (
              <section key={section.title}>
                <div className="flex items-baseline gap-5 mb-6">
                  <span className="font-display text-sm text-[#6B1421] tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display font-medium text-2xl md:text-3xl text-[#181612] lowercase tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="text-base md:text-lg text-ink-mid leading-relaxed lowercase space-y-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:marker:text-[#6B1421]/50">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          {/* Meta footer */}
          <div className="max-w-3xl mt-20 md:mt-28 pt-10 border-t border-[#181612]/12">
            <p className="text-sm text-ink-mid lowercase">
              last updated: may 2025
              <br />
              version: 1.0
            </p>
            <p className="text-sm text-ink-mid mt-4 lowercase">
              significant changes notified by email to active clients.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
