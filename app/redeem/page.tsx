'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RedeemPage() {
  const router = useRouter();
  const [code, setCode] = useState('');

  return (
    <div>
      <Link href="/" className="text-indigo text-[13px] underline">
        &larr; Back to dashboard
      </Link>
      <div className="bg-surface border border-line rounded p-6 mt-4">
        <h2 className="font-serif text-xl font-semibold">Enter your code</h2>
        <p className="text-inksoft text-sm mt-1 mb-5">
          Enter the code you were given to submit your measurements.
        </p>
        <input
          type="text"
          placeholder="e.g. 7QQ2XM"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border border-line rounded bg-surface2 text-[15px] uppercase focus:outline-none focus:ring-2 focus:ring-brass"
        />
        <button
          onClick={() => code.trim() && router.push(`/m/${code.trim()}`)}
          className="mt-5 bg-indigo hover:bg-indigodeep text-surface2 px-4 py-2 rounded text-[14px] font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
