import Image from "next/image";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "با تیم میم‌های شیعه آشنا شوید و بهترین میم‌های مذهبی و طنز شیعی را مشاهده کنید.",
};

export default function AboutUs() {
  return (
    <div className="AboutUs">
      <div className="Banner mb-6 md:mb-8">
        <div className="banner-image overflow-hidden rounded-[20px] drop-shadow-xl">
          <Image
            src="/banner/shia-meme-banner.jpg"
            alt="درباره ما"
            width={1200}
            height={400}
            priority
            quality={100}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>

      <div className="description mb-6 md:mb-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl">درباره ما</h1>
        <p className="mt-4 text-base leading-relaxed font-normal sm:text-lg">
          پرسشی که همواره با او دست به گریبان هستم مرا به ورطه های مختلف کشانید
          و ماحصلی بی مثال برای من به همراه داشت و برایم آموزگاری قهار گشت و به
          مثابه خود افرادی را پیرامون من جمع نمود.
        </p>
        <p className="mt-2 text-base leading-relaxed font-normal sm:text-lg">
          اندکی آموختم که در قیاس آموختن هیچست به گریبان هستم مرا به ورطه های
          مختلف کشانید و ماحصلی بی مثال برای من به همراه داشت و برایم آموزگاریست
          به گریبان هستم مرا به ورطه های مختلف کشانید و ماحصلی بی مثال برای من
          به همراه داشت و برایم آموزگاری قهار گشت و به مثابه خ قهار گشت و به
          مثابه خست به گریبان هستم مرا به ورطه های مختلف که مقصد را نیست و اینست
          نقطه تامل که
        </p>
      </div>

      <div className="mb-28 lg:mb-8">
        <div className="flex w-full flex-col items-stretch justify-between rounded-2xl bg-gradient-to-r from-[#29209D] to-[#635AD9] p-4 text-white md:flex-row md:p-6">
          {/* Item 1 */}
          <div className="flex flex-1 flex-col items-center justify-center gap-2 border-b border-white/10 py-4 md:border-b-0">
            <p className="text-3xl font-bold sm:text-4xl md:text-5xl">1670+</p>
            <span className="text-base font-semibold sm:text-lg md:text-xl">
              سال تاسیس
            </span>
          </div>

          {/* Item 2 */}
          <div className="flex flex-1 flex-col items-center justify-center gap-2 border-b border-white/10 py-4 md:border-r md:border-b-0">
            <p className="text-3xl font-bold sm:text-4xl md:text-5xl">1670+</p>
            <span className="text-base font-semibold sm:text-lg md:text-xl">
              سال تاسیس
            </span>
          </div>

          {/* Item 3 */}
          <div className="flex flex-1 flex-col items-center justify-center gap-2 border-b border-white/10 py-4 md:border-r md:border-b-0">
            <p className="text-3xl font-bold sm:text-4xl md:text-5xl">1670+</p>
            <span className="text-base font-semibold sm:text-lg md:text-xl">
              سال تاسیس
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-1 flex-col gap-3 border-white/10 py-4 sm:flex-row sm:justify-center md:flex-col md:items-center md:justify-center md:border-r">
            <a
              className="w-full min-w-[147px] rounded-2xl border border-white px-4 py-3 text-center text-base sm:w-auto sm:text-lg"
              href="#"
            >
              ارتباط با ادمین
            </a>
            <a
              className="w-full min-w-[147px] rounded-2xl border border-white px-4 py-3 text-center text-base sm:w-auto sm:text-lg"
              href="#"
            >
              حمایت مالی
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
