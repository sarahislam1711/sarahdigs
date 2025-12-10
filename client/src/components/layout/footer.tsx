export const Footer = () => {
  return (
    <footer className="bg-[#1B1B1B] text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="font-display font-bold text-2xl mb-4 md:mb-0">
          sarah<span className="text-[#4D00FF]">digs</span>.
        </div>
        <div className="text-sm opacity-50">
          &copy; {new Date().getFullYear()} SarahDigs Consultancy. All rights excavated.
        </div>
      </div>
    </footer>
  );
};