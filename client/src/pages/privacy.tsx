import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";

const sections = [
  {
    title: "what we collect",
    body: (
      <>
        <p>
          when you interact with sarahdigs, whether through our website, a
          contact form, a consultation call, or any other point of contact, we
          may collect the following types of information.
        </p>
        <p>
          <span className="text-[#181612] font-medium">information you give us directly:</span>
        </p>
        <ul>
          <li>your name and email address when you fill out a contact or inquiry form</li>
          <li>your business name, website, and a description of what you're working on</li>
          <li>any files, documents, or content you share with us during a project</li>
          <li>payment information processed through our third-party payment provider (we do not store your card details directly)</li>
          <li>any other information you choose to include when reaching out</li>
        </ul>
        <p>
          <span className="text-[#181612] font-medium">information collected automatically:</span>
        </p>
        <ul>
          <li>basic analytics data such as pages visited, time on site, and general location (country/city level)</li>
          <li>device type and browser information</li>
          <li>referral source (how you found the site)</li>
        </ul>
        <p>
          <span className="text-[#181612] font-medium">a note on minimalism:</span>{" "}
          we collect what we need to do the work well and communicate clearly.
          not more than that.
        </p>
      </>
    ),
  },
  {
    title: "how we use it",
    body: (
      <>
        <p>
          the information we collect is used for specific, clear purposes:
        </p>
        <ul>
          <li>to respond to your inquiry and understand what you need</li>
          <li>to scope, plan, and deliver project work</li>
          <li>to send you relevant project updates, invoices, or deliverables</li>
          <li>to improve how the site works based on how people use it</li>
          <li>to send occasional updates about sarahdigs (only if you've opted in, and always with an easy way out)</li>
        </ul>
        <p>
          we don't use your data to build audience profiles, run targeted
          advertising, or sell insights to anyone.
        </p>
      </>
    ),
  },
  {
    title: "what we don't do",
    body: (
      <>
        <p>to be direct about it:</p>
        <ul>
          <li>we do not sell your data. ever.</li>
          <li>we do not share your information with third parties for marketing purposes</li>
          <li>we do not run retargeting ads against you using your contact information</li>
          <li>we do not use your business information, strategy docs, or briefs to inform any other client's work</li>
          <li>we do not store payment details, all card processing goes through our third-party payment provider</li>
        </ul>
      </>
    ),
  },
  {
    title: "third-party tools",
    body: (
      <>
        <p>
          we use a small set of tools to run the business. each handles data
          according to their own privacy policies, which we've reviewed and
          consider reasonable:
        </p>
        <ul>
          <li>
            <span className="text-[#181612] font-medium">analytics</span>: we
            use a privacy-focused analytics tool to understand how the site is
            used. no cross-site tracking, no fingerprinting, no personal data
            stored.
          </li>
          <li>
            <span className="text-[#181612] font-medium">email</span>: client
            communications happen over email. we use a standard email provider.
            messages are stored in that provider's infrastructure.
          </li>
          <li>
            <span className="text-[#181612] font-medium">project management</span>:
            we may use a project management tool to track work. client files
            shared during a project are stored securely and only accessible to
            the team working on your project.
          </li>
          <li>
            <span className="text-[#181612] font-medium">payments</span>:
            invoicing and payment processing is handled by a third-party
            provider. they are responsible for the security of your payment
            data under their own terms.
          </li>
          <li>
            <span className="text-[#181612] font-medium">video calls</span>:
            consultation and client calls may be conducted via standard video
            conferencing tools. recording only happens with your explicit
            consent.
          </li>
        </ul>
        <p>
          if you want to know specifically which tools we use for a particular
          function, ask us directly.
        </p>
      </>
    ),
  },
  {
    title: "cookies",
    body: (
      <>
        <p>our site uses a minimal set of cookies:</p>
        <ul>
          <li>
            <span className="text-[#181612] font-medium">strictly necessary cookies</span>:
            these keep the site functioning (form state, navigation). they
            don't track you.
          </li>
          <li>
            <span className="text-[#181612] font-medium">analytics cookies</span>:
            lightweight, privacy-respecting data about how people use the
            site. no cross-site tracking. no personal identification.
          </li>
        </ul>
        <p>
          we don't use advertising cookies, social media tracking pixels, or
          third-party cookies that follow you around the web.
        </p>
        <p>
          you can disable cookies in your browser settings at any time. the
          site will still work without them.
        </p>
      </>
    ),
  },
  {
    title: "data retention",
    body: (
      <>
        <p>we keep your information for as long as it's useful and no longer:</p>
        <ul>
          <li>
            <span className="text-[#181612] font-medium">inquiries that don't lead to a project</span>:
            retained for up to 12 months, then deleted
          </li>
          <li>
            <span className="text-[#181612] font-medium">active client data</span>:
            retained for the duration of the project plus 24 months after
            completion, in case questions or follow-up work arise
          </li>
          <li>
            <span className="text-[#181612] font-medium">invoices and financial records</span>:
            retained for as long as legally required in our operating
            jurisdiction
          </li>
          <li>
            <span className="text-[#181612] font-medium">analytics data</span>:
            anonymized and aggregated, retained in aggregate form only
          </li>
        </ul>
        <p>
          if you'd like your data removed before these windows, email us and
          we'll handle it promptly.
        </p>
      </>
    ),
  },
  {
    title: "your rights",
    body: (
      <>
        <p>
          regardless of where you're located, we respect the following rights:
        </p>
        <ul>
          <li>
            <span className="text-[#181612] font-medium">access</span>: you can
            ask what data we hold on you
          </li>
          <li>
            <span className="text-[#181612] font-medium">correction</span>: you
            can ask us to update or correct inaccurate data
          </li>
          <li>
            <span className="text-[#181612] font-medium">deletion</span>: you
            can ask us to delete your data, subject to any legal obligations to
            retain records
          </li>
          <li>
            <span className="text-[#181612] font-medium">portability</span>:
            you can ask for a copy of your data in a readable format
          </li>
          <li>
            <span className="text-[#181612] font-medium">withdrawal of consent</span>:
            if you've opted into any communications, you can unsubscribe at
            any time
          </li>
        </ul>
        <p>
          to exercise any of these rights, email{" "}
          <a
            href="mailto:sarah@sarahdigs.com"
            className="text-[#6B1421] underline underline-offset-4 decoration-[#6B1421]/40 hover:decoration-[#6B1421] transition-colors"
          >
            sarah@sarahdigs.com
          </a>
          . we'll respond within 14 days.
        </p>
      </>
    ),
  },
  {
    title: "security",
    body: (
      <>
        <p>
          we take reasonable and appropriate measures to protect your
          information from unauthorized access, loss, or misuse. this includes:
        </p>
        <ul>
          <li>encrypted connections (https) across the site</li>
          <li>restricted access to client data within our tools</li>
          <li>not storing sensitive data (card numbers, passwords) ourselves</li>
        </ul>
        <p>
          no system is completely secure. if you have a concern about a
          specific type of data, ask us how it's handled before sharing it.
        </p>
      </>
    ),
  },
  {
    title: "contact",
    body: (
      <>
        <p>
          questions about this policy, or anything related to how we handle
          your data, reach out.
        </p>
        <p>
          <span className="text-[#181612] font-medium">sarahdigs</span>
          <br />
          for privacy-related questions:{" "}
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

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#181612] font-sans selection:bg-[#6B1421] selection:text-[#F4F1EA]">
      <SEO
        title="privacy | sarahdigs"
        description="How sarahdigs collects, uses, and protects your data."
        canonical="/privacy"
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
              privacy.
            </h1>
            <p className="text-lg md:text-xl text-ink-mid leading-relaxed lowercase">
              how sarahdigs collects, uses, and protects your data, plainly,
              with no surprises.
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
              changes are posted here. significant changes notified by email to
              active clients.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
