import Link from "next/link";

interface AuthShellProps {
  children: React.ReactNode;
}

function SentraLogo() {
  return (
    <Link
      href="/"
      aria-label="SentraUMKM — kembali ke beranda"
      className="group inline-flex w-fit items-center gap-2.5"
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[0.9rem] bg-gradient-to-br from-[#FFA726] to-[#F08300] shadow-[0_8px_18px_-8px_rgba(240,131,0,0.9)] ring-1 ring-black/[0.04] transition-transform duration-200 group-hover:-translate-y-px">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent"
        />
        <span className="relative text-[1.15rem] font-black leading-none tracking-[-0.04em] text-white">
          S
        </span>
      </span>
      <span className="flex flex-col justify-center">
        <span className="whitespace-nowrap text-[1.28rem] font-extrabold leading-none tracking-[-0.03em] text-[#111827]">
          Sentra<span className="text-[#FF8F00]">UMKM</span>
        </span>
        <span className="mt-1 whitespace-nowrap text-[8px] font-bold uppercase leading-none tracking-[0.18em] text-[#9CA3AF]">
          Pasar UMKM Indonesia
        </span>
      </span>
    </Link>
  );
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-white lg:grid lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
      {/* Panel kiri */}
      <aside className="relative flex flex-col overflow-hidden bg-[#FF8F00] px-6 py-6 text-white sm:px-12 sm:py-12 lg:h-full lg:px-16 lg:py-12 xl:px-24 xl:py-14">
        {/* Pola garis melingkar */}
        <svg
          className="pointer-events-none absolute -bottom-[28%] -left-[38%] h-[135%] w-[170%] text-white/[0.14]"
          viewBox="0 0 1000 1000"
          fill="none"
          preserveAspectRatio="xMinYMax slice"
          aria-hidden="true"
        >
          {[360, 480, 600, 720, 840, 960].map((radius) => (
            <circle
              key={radius}
              cx="90"
              cy="980"
              r={radius}
              stroke="currentColor"
              strokeWidth="1.2"
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        {/* Gelombang batas kanan (desktop) */}
        <svg
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-12 text-white lg:block"
          viewBox="0 0 48 1000"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M46 0C46 84 16 166 16 250C16 334 46 416 46 500C46 584 16 666 16 750C16 834 46 916 46 1000L48 1000L48 0Z"
            fill="currentColor"
          />
        </svg>

        {/* Gelombang batas bawah (mobile & tablet) */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-full text-white lg:hidden"
          viewBox="0 0 900 48"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 46C75 46 150 14 225 14C300 14 375 46 450 46C525 46 600 14 675 14C750 14 825 46 900 46L900 48L0 48Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative flex flex-1 flex-col justify-center">
          <h1 className="max-w-xl text-[1.9rem] font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-[3rem] xl:text-[3.9rem]">
            Halo,
            <br />
            Sobat Sentra!
          </h1>

          <p className="mt-5 hidden max-w-md text-[12.5px] leading-relaxed text-white/85 sm:mt-5 sm:block sm:text-[13.5px]">
            Belanja kriya, tenun, dan kopi lokal langsung dari pengrajin
            Nusantara — atau buka toko UMKM-mu dan jangkau pembeli dari seluruh
            Indonesia.
          </p>
        </div>

        <p className="relative mt-8 hidden text-[11px] text-white/60 sm:block">
          © 2025 Sentra UMKM Indonesia. Menghubungkan pengrajin &amp; pembeli
          langsung.
        </p>
      </aside>

      {/* Panel kanan */}
      <main className="flex min-h-screen flex-col bg-white px-6 pb-10 pt-7 sm:px-12 sm:pt-10 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:px-16 lg:pb-10 lg:pt-10 xl:px-24">
        <div className="flex items-center justify-between">
          <SentraLogo />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9CA3AF] transition-colors hover:text-[#FF8F00] lg:hidden"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Beranda
          </Link>
        </div>

        <div className="flex flex-1 flex-col py-10 lg:py-12">
          <div className="auth-fade-up my-auto w-full max-w-[400px]">
            {children}
          </div>
        </div>

        <p className="text-center text-[10px] text-[#9CA3AF] sm:hidden">
          © 2025 Sentra UMKM Indonesia
        </p>
      </main>
    </div>
  );
}
