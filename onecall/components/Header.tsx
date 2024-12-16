import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          One Caller OTP
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link href="/help">Help</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

