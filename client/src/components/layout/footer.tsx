import { Link } from "wouter";
import { Mail, Linkedin } from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/in/sarahislamm/";
const EMAIL = "sarah@sarahdigs.com";

export const Footer = () => {
  return (
    <footer className="bg-[#181612] text-[#F4F1EA] py-12 border-t border-white/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        {/* Brand block */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="font-display font-bold text-2xl lowercase">
            sarah<span className="text-[#6B1421]">digs</span>.
          </Link>
          <p className="text-sm text-[#F4F1EA]/55 leading-snug lowercase">
            beautiful websites, built to convert.
          </p>

          {/* Social buttons */}
          <div className="flex items-center gap-3 mt-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="sarahdigs on LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-[#F4F1EA]/75 hover:text-[#F4F1EA] hover:border-[#6B1421] hover:bg-[#6B1421]/20 transition-colors"
            >
              <Linkedin className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              aria-label={`Email sarahdigs at ${EMAIL}`}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/15 text-sm text-[#F4F1EA]/75 hover:text-[#F4F1EA] hover:border-[#6B1421] hover:bg-[#6B1421]/20 transition-colors lowercase"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              {EMAIL}
            </a>
          </div>
        </div>

        {/* Links + copyright */}
        <div className="flex flex-col items-start md:items-end gap-3 text-sm">
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors lowercase"
            >
              privacy policy
            </Link>
            <Link
              href="/terms"
              className="text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors lowercase"
            >
              terms of service
            </Link>
          </div>
          <span className="text-[#F4F1EA]/40 lowercase">
            &copy; {new Date().getFullYear()} sarahdigs. all rights excavated.
          </span>
        </div>
      </div>
    </footer>
  );
};
