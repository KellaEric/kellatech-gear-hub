import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "233201926457";
const DEFAULT_MESSAGE = "Hello Kella's Tech! I'd like to make an enquiry.";

const WhatsAppButton = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 left-6 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform group-hover:scale-110">
        {/* WhatsApp glyph */}
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.522-1.318.13-.244.187-.5.187-.787 0-.4-.058-.815-.244-1.16-.142-.243-.244-.314-.345-.43z" />
          <path d="M16.012 4C9.39 4 4.005 9.385 4.005 16.005c0 2.105.55 4.16 1.595 5.974L4 28l6.182-1.59a11.96 11.96 0 0 0 5.83 1.49h.005c6.62 0 12.005-5.385 12.005-12.005 0-3.21-1.25-6.225-3.516-8.494A11.93 11.93 0 0 0 16.012 4zm0 21.99h-.004a9.97 9.97 0 0 1-5.08-1.39l-.365-.215-3.673.964.98-3.583-.236-.37a9.97 9.97 0 0 1-1.527-5.296c0-5.514 4.486-10 10.005-10a9.93 9.93 0 0 1 7.07 2.93 9.93 9.93 0 0 1 2.926 7.075c0 5.514-4.486 10-10.005 10z" />
        </svg>
      </span>
    </a>
  );
};

export default WhatsAppButton;
