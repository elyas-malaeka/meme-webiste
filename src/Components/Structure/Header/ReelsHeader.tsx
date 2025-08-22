import Image from "next/image";
import NavLinks from "./NavLinks";
import ThemeChange from "./ThemeChange";

const ReelsHeader = () => {
  return (
    <>
      <nav
        className="bg-bg-gradient-2 sticky top-8 z-50 flex max-w-[367px] min-w-[367px] flex-col justify-between gap-8 rounded-[20px] p-8 shadow-2xl max-lg:hidden"
        style={{
          height: "clamp(600px, calc(100vh - 4rem), 958px)",
          minHeight: "768px",
          maxHeight: "958px",
        }}
      >
        <div className="header-top flex max-w-[250px] flex-shrink-0 flex-col justify-between">
          <div className="logo mb-8 flex items-center gap-4">
            <div className="image-logo relative flex-shrink-0 overflow-hidden rounded-2xl">
              <Image
                src="/logo/shia-meme-logo.jpg"
                alt="Logo"
                width={80}
                height={80}
                priority
                className="h-auto max-h-[160px] w-auto max-w-[160px]"
              />
            </div>
            <div className="flex flex-shrink-0 flex-col">
              <span className="text-secondary text-xl font-extrabold">
                میم شیعه
              </span>
              <span className="text-secondary text-lg font-extrabold">
                shia meme
              </span>
            </div>
          </div>
          <div className="navlinks min-h-0 flex-1 overflow-y-auto">
            <NavLinks />
          </div>
        </div>

        <div className="header-bottom flex-shrink-0 space-y-4">
          <div className="darkmode-button bg-primary-40 flex items-center justify-between rounded-[20px] p-4 text-xl">
            <span className="text-secondary font-medium">حالت تاریک</span>
            <ThemeChange />
          </div>

          <div className="pwa rounded-xl bg-[#D6EAF8] p-6 text-center">
            <h5 className="mb-2 text-[21px] font-semibold text-black">
              استفاده از در حالت PWA
            </h5>
            <p className="py-3 leading-relaxed font-semibold text-black">
              برای استفاده بهتر و دسترسی راحت‌تر از حالت اپلیکیشن استفاده کنید.
            </p>
            <button className="btn–gradient mt-2 w-full cursor-pointer rounded-xl py-4 text-lg font-semibold transition-all duration-200 hover:shadow-lg active:scale-95">
              دانلود نسخه PWA
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default ReelsHeader;
