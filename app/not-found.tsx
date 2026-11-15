import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <Image
          src="/logos/logo-full.png"
          alt="YourBench Store"
          width={180}
          height={48}
          className="mx-auto mb-8"
        />
        <h1 className="font-serif text-7xl sm:text-9xl font-bold text-primary mb-4">
          404
        </h1>
        <p className="text-muted text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-8 rounded-xl transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
